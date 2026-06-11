import {Request,Response} from 'express';
import { CookieOptions } from 'express';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/auth',
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
};

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
};

// Reads the refresh token from the incoming request cookie
export const getRefreshTokenFromRequest = (req: Request) => req.cookies?.[REFRESH_TOKEN_COOKIE];