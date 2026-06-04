import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { AuthUser, tokenCredentials } from "./type.auth";
import { AppError } from "../../middleware/app-error";
import { redisClient } from '../../../redis';
import crypto from 'crypto';
import { ROLE_ID } from '../../constants/roles';
import { handleServiceError } from '../../utils/serviceError';

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
}

export const verifyAccessToken = (token: string): tokenCredentials => {
    try {
        const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
        const decoded = jwt.verify(token, publicKey) as { tokenCredentials: tokenCredentials };
        return decoded.tokenCredentials;
    } catch {
        throw new AppError('Invalid access token', 401);
    }
}

export const verifyRefreshToken = (token: string): tokenCredentials => {
    try {
        const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
        const decoded = jwt.verify(token, publicKey) as { tokenCredentials: tokenCredentials };
        return decoded.tokenCredentials;
    } catch {
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
        await redisClient.del(`otp:${personId}`);
        return true;
    } catch (error) {
        handleServiceError(error, 'verifyOTP', 'Failed to verify OTP');
    }
}

export const formatTokenCredentials = (userData: AuthUser): tokenCredentials => {
    switch (userData.role) {
        case ROLE_ID.STUDENT:
            return {
                studentId: userData.student?.studentId,
                personId: userData.personId,
                role: userData.role,
                course: userData.student?.course?.name
            };
        case ROLE_ID.FACULTY:
            return {
                facultyId: userData.faculty?.facultyId,
                personId: userData.personId,
                role: userData.role,
                department: userData.faculty?.department?.name
            };
        case ROLE_ID.ADMIN:
            return {
                adminId: userData.admin?.adminId,
                personId: userData.personId,
                role: userData.role,
                office: userData.admin?.office?.name
            };
        case ROLE_ID.DEAN:
            return {
                deanId: userData.dean?.deanId,
                personId: userData.personId,
                role: userData.role,
                department: userData.dean?.department?.name
            };
        case ROLE_ID.PROGRAM_CHAIR:
            return {
                programChairId: userData.programChair?.programChairId,
                personId: userData.personId,
                role: userData.role,
                course: userData.programChair?.course?.name
            };
        case ROLE_ID.STAFF:
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