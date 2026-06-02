import { Request, Response, NextFunction } from 'express';
import { login, refreshAccessToken, deleteRefreshTokens, sendOTP,resetPassword } from "./auth.service";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "./auth.utils";
import { AppError } from "../../middleware/app-error";
import redisClient from '../../../redis';
import { tokenCredentials } from "./type.auth";


export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginData = req.body;
        const tokens = await login(loginData);
        res.json({
            success: true,
            message: 'Login successful',
            ...tokens
        });
    } catch (error) {
        next(error);
    }
}

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        // const accessToken = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined; // Extract token from Bearer token

        console.log('Access Token for logout:', accessToken);
        if (!accessToken) {
            throw new AppError('No access token provided', 401);
        }

        const tokenCredentials = verifyAccessToken(accessToken) as tokenCredentials;

        await deleteRefreshTokens(tokenCredentials.personId);

        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.headers['authorization']?.split(' ')[1];

        if (!refreshToken) {
            throw new AppError('No refresh token provided', 401);
        }

        const result = await refreshAccessToken(refreshToken);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            ...result
        });

    } catch (error) {
        next(error);
    }
}

export const sendOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        
        const otp = await sendOTP({ username });

        res.json({
            success: true,
            message: 'OTP sent successfully',
            otp // In production, you would not return the OTP in the response
        });

    }catch (error) {
        next(error);
    }
}

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, otp, newPassword, repeatNewPassword } = req.body;
       
        if (newPassword !== repeatNewPassword) {
            throw new AppError('Passwords do not match', 400);
        }

        const resetData = { username, otp, newPassword };
        const result = await resetPassword(resetData);

        res.json({
            success: true,
            message: 'Password reset successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
}
