import { persons } from "../../db/Person";
import { verifyPassword, hashPassword, generateOTP, generateAccessToken, generateRefreshToken, formatTokenCredentials, verifyRefreshToken, verifyOTP } from "./auth.utils";
import { AppError } from "../../middleware/app-error";
import { changePasswordRequest, loginRequest, otpRequest, resetPasswordRequest } from "./type.auth";
import { db } from "../../db/client";
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { redisClient } from "../../../redis";
import { sendEmail } from '../common.utils';
import { handleServiceError } from '../../utils/serviceError';
import logger from '../../../logger';

export const login = async (loginData: loginRequest) => {
    try {
        const user = await db.query.persons.findFirst({
            where: eq(persons.username, loginData.username),
            columns: { personId: true, role: true, password: true },
            with: {
                student: {
                    columns: { studentId: true }, with: {
                        course: { columns: { name: true } }
                    }
                },
                faculty: {
                    columns: { facultyId: true }, with: {
                        department: { columns: { name: true } }
                    }
                },
                admin: {
                    columns: { adminId: true }, with: {
                        office: { columns: { name: true } }
                    }
                },
                dean: {
                    columns: { deanId: true }, with: {
                        department: { columns: { name: true } }
                    }
                },
                programChair: {
                    columns: { programChairId: true }, with: {
                        course: { columns: { name: true } }
                    }
                },
                staff: {
                    columns: { staffId: true }, with: {
                        office: { columns: { name: true } }
                    }
                },
            },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await verifyPassword(loginData.password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const tokenCredentials = formatTokenCredentials(user);
        const accessToken = generateAccessToken(tokenCredentials);
        const refreshToken = generateRefreshToken(tokenCredentials);

        await redisClient.setEx(`refreshToken:${user.personId}`, 7 * 24 * 60 * 60, refreshToken);

        logger.info('User logged in', { personId: user.personId, role: user.role });

        return { accessToken, refreshToken };
    } catch (error) {
        handleServiceError(error, 'login', 'Login failed');
    }
}

export const deleteRefreshTokens = async (personId: number) => {
    try {
        await redisClient.del(`refreshToken:${personId}`);
        await redisClient.del(`accessToken:${personId}`);
        logger.info('User logged out', { personId });
    } catch (error) {
        handleServiceError(error, 'deleteRefreshTokens', 'Failed to delete refresh tokens');
    }
}

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const tokenCredentials = verifyRefreshToken(refreshToken);
        const storedRefreshToken = await redisClient.get(`refreshToken:${tokenCredentials.personId}`);

        if (!storedRefreshToken) {
            throw new AppError('Refresh token not found', 401);
        }

        if (storedRefreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', 401);
        }

        const accessToken = generateAccessToken(tokenCredentials);
        await redisClient.setEx(`accessToken:${tokenCredentials.personId}`, 15 * 60, accessToken);
        return { accessToken };
    } catch (error) {
        handleServiceError(error, 'refreshAccessToken', 'Failed to refresh access token');
    }
}

export const sendOTP = async (otpData: otpRequest) => {
    try {
        const user = await db.query.persons.findFirst({
            where: eq(persons.username, otpData.username),
            columns: { personId: true, email: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const checkExistingOTP = await redisClient.get(`otp:${user.personId}`);
        if (checkExistingOTP) {
            throw new AppError('An OTP has already been sent. Please check your email.', 429);
        }

        const otp = generateOTP();
        await sendEmail({
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        });
        await redisClient.setEx(`otp:${user.personId}`, 5 * 60, otp);

        logger.info('OTP sent', { personId: user.personId });
    } catch (error) {
        handleServiceError(error, 'sendOTP', 'Failed to send OTP');
    }
}

export const resetPassword = async (resetData: resetPasswordRequest) => {
    try {
        const { username, otp, newPassword } = resetData;

        const user = await db.query.persons.findFirst({
            where: eq(persons.username, username),
            columns: { personId: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        await verifyOTP(user.personId, otp);

        const hashedPassword = await hashPassword(newPassword);
        await db.update(persons).set({ password: hashedPassword }).where(eq(persons.personId, user.personId));

        logger.info('Password reset', { personId: user.personId });
        return { success: true, message: 'Password reset successful' };
    } catch (error) {
        handleServiceError(error, 'resetPassword', 'Failed to reset password');
    }
}

export const changePassword = async (data: changePasswordRequest) => {
    try {
        const user = await db.query.persons.findFirst({
            where: eq(persons.personId, data.personId),
            columns: { password: true },
        });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const isMatch = await verifyPassword(data.currentPassword, user.password);
        if (!isMatch) {
            throw new AppError('Current password is incorrect', 401);
        }
        const hashedPassword = await hashPassword(data.newPassword);
        await db.update(persons).set({ password: hashedPassword }).where(eq(persons.personId, data.personId));

        logger.info('Password changed', { personId: data.personId });
        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        handleServiceError(error, 'changePassword', 'Failed to change password');
    }
}
