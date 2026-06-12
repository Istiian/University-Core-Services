import express, {Request, Response, NextFunction} from 'express';
import routesIAS from './routes/IAS.routes';
import dotenv from 'dotenv';
import cors from 'cors';
import {AppError} from './utils/AppError';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import {apiRateLimiter} from './middleware/rateLimit';
const app = express();
dotenv.config();

const PORT = process.env.PORT 
const AllowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
    origin: AllowedOrigins,
    credentials: true,
}));

const appRateLimiter = apiRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again after 15 minutes'
});

app.use('/IAS', requestLogger, appRateLimiter, routesIAS);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Gateway API!');
});

app.listen(PORT, () => {
    console.log(`Gateway API is running on port ${PORT}`);
});

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404);
    next(error);
});

// Global error handler
app.use(errorHandler);