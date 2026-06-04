import logger from '../../logger';
import { AppError } from '../middleware/app-error';

/** Re-throw AppError unchanged; log and wrap unexpected errors as 500. */
export function handleServiceError(
    error: unknown,
    context: string,
    fallbackMessage = 'Internal server error',
): never {
    if (error instanceof AppError) {
        throw error;
    }
    logger.error(`${context}:`, error);
    throw new AppError(fallbackMessage, 500);
}
