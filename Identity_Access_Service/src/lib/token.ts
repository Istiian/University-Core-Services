import jwt from 'jsonwebtoken';
import { tokenCredentials } from "../module/auth/type.auth";
import { AppError } from "../utils/AppError";
import fs from 'fs';

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH as string, 'utf8');
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');

export const generateAccessToken = (credentials: tokenCredentials): string => {
    return jwt.sign(credentials, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
};

export const generateRefreshToken = (credentials: tokenCredentials): string => {
    return jwt.sign(credentials, privateKey, { algorithm: 'RS256', expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): tokenCredentials => {
    try {
        return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as tokenCredentials;
    } catch {
        throw new AppError('Invalid or expired refresh token', 401);
    }
};
