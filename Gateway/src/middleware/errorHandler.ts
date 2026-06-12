
import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (statusCode >= 500) {
        logger.error({
            message: message,
            stack: err.stack,
            statusCode: statusCode,
            method: req.method,
            url: req.originalUrl
        })
    }else{
        logger.warn({
            message: message,
            statusCode: statusCode
        })
    }
    res.status(statusCode).json({
        success: false,
        error: message
    });
}

