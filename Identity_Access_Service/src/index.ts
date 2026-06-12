import dotenv from "dotenv";
dotenv.config();

import {errorHandler} from "./middleware/errorHandler";
import express from "express";
import cookieParser from "cookie-parser";
import {AppError} from "./utils/AppError";
import {logger} from "./utils/logger";

// Routes
import userRoutes from "./module/user/user.routes";
import authRoutes from "./module/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/IAS/users', userRoutes);
app.use('/IAS/auth', authRoutes);

// 404 handler
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
