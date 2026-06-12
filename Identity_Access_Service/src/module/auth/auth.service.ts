import { AppError } from "../../utils/AppError";
import { changePasswordRequest, loginRequest, otpRequest, resetPasswordRequest } from "./type.auth";
import { db } from "../../db/client";
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { user } from "../../db/schema";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../lib/token";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import { randomInt } from 'crypto';
import { sendEmail } from "../../utils/sendEmail";
import { redisClient } from "../../config/redis";

export const login = async (loginData: loginRequest) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.username, loginData.username),
        columns: { userId: true, role: true, password: true },
    });

    if (!userRecord) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(loginData.password, userRecord.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const tokenCredentials = {
        userId: userRecord.userId,
        role: userRecord.role,
    };

    const accessToken = generateAccessToken(tokenCredentials);
    const refreshToken = generateRefreshToken(tokenCredentials);

    return { accessToken, refreshToken };
};

export const refreshToken = async (token: string) => {
    const payload = verifyRefreshToken(token);

    const tokenCredentials = {
        userId: payload.userId,
        role: payload.role,
    };

    const accessToken = generateAccessToken(tokenCredentials);
    return { accessToken };
};

export const requestOTP = async (otpData: otpRequest) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.username, otpData.username),
        columns: { userId: true, email: true },
    });

    if (!userRecord) {
        throw new AppError('User not found', 404);
    }

    const isOTPSent = await redisClient.get(`otp:${userRecord.userId}`);
    if (isOTPSent) {
        throw new AppError('OTP already sent. Please wait before requesting a new one.', 429);
    }

    const otp = randomInt(100000, 999999).toString();

    await redisClient.setEx(`otp:${userRecord.userId}`, 300, otp);
    await sendEmail(
        userRecord.email,
        'Your OTP Code',
        `Your OTP code is: ${otp}\n\nThis code will expire in 5 minutes.`
    );
};

export const verifyOTP = async (username: string, otp: string) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.username, username),
        columns: { userId: true },
    });

    if (!userRecord) {
        throw new AppError('User not found', 404);
    }

    const storedOTP = await redisClient.get(`otp:${userRecord.userId}`);
    if (!storedOTP || storedOTP !== String(otp)) {
        throw new AppError('Invalid or expired OTP', 400);
    }
    await redisClient.del(`otp:${userRecord.userId}`);
};

export const resetPassword = async (resetData: resetPasswordRequest) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.username, resetData.username),
        columns: { userId: true },
    });

    if (!userRecord) {
        throw new AppError('User not found', 404);
    }

    const storedOTP = await redisClient.get(`otp:${userRecord.userId}`);
    if (!storedOTP || storedOTP !== resetData.otp) {
        throw new AppError('Invalid or expired OTP', 400);
    }
    if (resetData.newPassword !== resetData.repeatNewPassword) {
        throw new AppError('New password and repeat password do not match', 400);
    }
    const hashedPassword = await hashPassword(resetData.newPassword);
    await db.update(user).set({ password: hashedPassword }).where(eq(user.userId, userRecord.userId));
    await redisClient.del(`otp:${userRecord.userId}`);
};

export const changePassword = async (changeData: changePasswordRequest, userId: number) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.userId, userId),
        columns: { password: true },
    });

    if (!userRecord) {
        throw new AppError('User not found', 404);
    }

    const isCurrentPasswordValid = await comparePassword(changeData.currentPassword, userRecord.password);
    if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
    }

    const hashedNewPassword = await hashPassword(changeData.newPassword);
    await db.update(user).set({ password: hashedNewPassword }).where(eq(user.userId, userId));
};

export const changePasswordForAdmin = async (changeData: changePasswordRequest, userId: number) => {
    const userRecord = await db.query.user.findFirst({
        where: eq(user.userId, userId),
        columns: { password: true },
    });

    if (!userRecord) {
        throw new AppError('User not found', 404);
    }

    const hashedNewPassword = await hashPassword(changeData.newPassword);
    await db.update(user).set({ password: hashedNewPassword }).where(eq(user.userId, userId));
}