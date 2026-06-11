import { createClient } from 'redis';
import {logger} from '../utils/logger';
import {AppError} from '../utils/AppError';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    RESP: 2
});

redisClient.on('error', (err) => {
    throw new AppError('Redis client error', 500);
});

redisClient.connect().then(() => {
    logger.info('Connected to Redis');
}).catch((err) => {
    throw new AppError('Failed to connect to Redis', 500);
});

export default redisClient;
