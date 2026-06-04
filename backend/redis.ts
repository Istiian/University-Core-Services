import { createClient } from 'redis';
import logger from './logger';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    RESP: 2
});

redisClient.on('error', (err) => {
    if (err instanceof Error) {
        logger.error('Redis client error', { message: err.message });
    } else {
        logger.error('Redis client error', { err });
    }
});

redisClient.connect().then(() => {
    logger.info('Connected to Redis');
}).catch((err) => {
    logger.error('Redis connection error', { err });
});

export default redisClient;
