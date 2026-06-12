import { createClient } from 'redis';
import {logger} from '../utils/logger';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    RESP: 2
});

redisClient.on('error', (err) => {
    logger.error(`Redis client error: ${err}`);
});

redisClient.connect().then(() => {
    logger.info('Connected to Redis');
}).catch((err) => {
    logger.error(`Failed to connect to Redis: ${err}`);
    process.exit(1);
});

export default redisClient;
