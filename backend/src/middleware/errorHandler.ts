import { ErrorRequestHandler } from 'express';
import logger from '../../logger';
import { AppError } from './app-error';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : (err instanceof Error ? err.message : 'Internal Server Error');

  if (statusCode >= 500) {
    logger.error('Request failed', { statusCode, message, stack: err instanceof Error ? err.stack : undefined });
  } else {
    logger.warn('Request rejected', { statusCode, message });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
