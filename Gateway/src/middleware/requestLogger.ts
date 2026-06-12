import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    res.on('finish', () => {
        const { method, originalUrl, ip } = req;
        const statusCode = res.statusCode;
        const message = `${method} ${originalUrl} ${statusCode} - ${ip}`;

        if (statusCode >= 500) {
            logger.error(message);
        } else if (statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    }
    );
    next();
};