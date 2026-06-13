import { Request, Response, NextFunction } from "express";
import {
    login,
    refreshToken,
    requestOTP,
    verifyOTP,
    resetPassword,
    changePassword,
    logout,
} from "./auth.service";
import {
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
    getRefreshTokenFromRequest,
} from "../../utils/authCookie";
import { AppError } from "../../utils/AppError";

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken, refreshToken: newRefreshToken } = await login(req.body);
        setRefreshTokenCookie(res, newRefreshToken);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getRefreshTokenFromRequest(req);
        if (!token) throw new AppError('Refresh token not found', 401);

        const { accessToken } = await refreshToken(token);
        res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully',
            accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIdHeader = req.headers['x-user-id'];
        if (!userIdHeader) {
            throw new AppError('Unauthorized', 401);
        }
        const userId = Number(userIdHeader);
        if (Number.isNaN(userId)) {
            throw new AppError('Invalid user ID', 401);
        }
        if (await logout(userId)) {
            clearRefreshTokenCookie(res);
        }
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const requestOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await requestOTP(req.body);
        res.status(200).json({
            success: true,
            message: 'OTP sent to registered email'
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOTPHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, otp } = req.body;
        await verifyOTP(username, otp);
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resetPassword(req.body);
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        next(error);
    }
};

export const changePasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIdHeader = req.headers['x-user-id'];

        if (!userIdHeader) {
            throw new AppError('Unauthorized', 401);
        }

        const userId = Number(userIdHeader);
        if (Number.isNaN(userId)) {
            throw new AppError('Invalid user ID', 401);
        }

        await changePassword(req.body, userId);
        res.status(200).json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        next(error);
    }
};

export const changePasswordHandlerForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            throw new AppError('Invalid user ID', 400);
        }

        await changePassword(req.body, userId);
        res.status(200).json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        next(error);
    }
}