import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { persons } from "../../db/Person"
import { AuthUser, tokenCredentials } from "./type.auth";
import { AppError } from "../../middleware/app-error";
import { redisClient } from '../../../redis';

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

export const verifyAccessToken = (token: string): tokenCredentials => {
    try {
        const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
        const decoded = jwt.verify(token, publicKey) as { tokenCredentials: tokenCredentials };
        return decoded.tokenCredentials;
    } catch (error) {
        throw new AppError('Invalid access token', 401);
    }
}

export const verifyRefreshToken = (token: string): tokenCredentials => {
    try {
        const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
        const decoded = jwt.verify(token, publicKey) as { tokenCredentials: tokenCredentials };
        return decoded.tokenCredentials;
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
}

export const generateAccessToken = (tokenCredentials: tokenCredentials): string => {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH as string, 'utf8');
    const accessToken = jwt.sign({ tokenCredentials }, privateKey, { expiresIn: '15m', algorithm: 'RS256' });
    return accessToken;
}

export const generateRefreshToken = (tokenCredentials: tokenCredentials): string => {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH as string, 'utf8');
    const refreshToken = jwt.sign({ tokenCredentials }, privateKey, { expiresIn: '7d', algorithm: 'RS256' });
    return refreshToken;
}

export const verifyOTP = async (personId: number, otp: string): Promise<boolean> => {
    try {
        const storedOTP = await redisClient.get(`otp:${personId}`);
        if (!storedOTP) {
            throw new AppError('OTP expired or not found', 404);
        }
        if (storedOTP !== otp) {
            throw new AppError('Invalid OTP', 401);
        }
        await redisClient.del(`otp:${personId}`); // Delete OTP after successful verification
        return true;
    } catch (error) {
        throw new AppError('Failed to verify OTP', 500);
    }
}

export const formatTokenCredentials = (userData: AuthUser): tokenCredentials => {
    switch (userData.role) {
        case 2:
            return {
                studentId: userData.student?.studentId,
                personId: userData.personId,
                role: userData.role,
                course: userData.student?.course?.name
            };
        // Add cases for other roles as needed
        case 3:
            return {
                facultyId: userData.faculty?.facultyId,
                personId: userData.personId,
                role: userData.role,
                department: userData.faculty?.department?.name
            };
        case 1:
            return {
                adminId: userData.admin?.adminId,
                personId: userData.personId,
                role: userData.role,
                office: userData.admin?.office?.name
            };
        case 5:
            return {
                deanId: userData.dean?.deanId,
                personId: userData.personId,
                role: userData.role,
                department: userData.dean?.department?.name
            };
        case 6:
            return {
                programChairId: userData.programChair?.programChairId,
                personId: userData.personId,
                role: userData.role,
                course: userData.programChair?.course?.name
            };
        case 4:
            return {
                staffId: userData.staff?.staffId,
                personId: userData.personId,
                role: userData.role,
                office: userData.staff?.office?.name
            };
        default:
            return {
                personId: userData.personId,
                role: userData.role
            };
    }
}