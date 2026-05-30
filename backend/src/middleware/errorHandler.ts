import { ErrorRequestHandler } from 'express';
import logger from '../../logger'

type AppError = Error & {
  statusCode?: number;
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const appError = err as AppError;
  const statusCode = appError.statusCode ?? 500;
  const message = appError.message || 'Internal Server Error';

  if(statusCode === 500) {
    logger.error('Internal Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
