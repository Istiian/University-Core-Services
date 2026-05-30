import { createClient } from 'redis';
import { AppError } from "./src/middleware/app-error";

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    RESP: 2
});

redisClient.on('error', (err) => {
    if (err instanceof Error) {
        console.error(`Redis Client Error: ${err.message}`);
    } else {
        console.error('Redis Client Error:', err);
    }
});

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Redis connection error:', err);
});


export default redisClient;

