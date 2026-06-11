import {errorHandler} from "./middleware/errorHandler";
import express from "express";
import cookieParser from "cookie-parser";
import {AppError} from "./utils/AppError";
import dotenv from "dotenv";
import {logger} from "./utils/logger";

// Routes
import userRoutes from "./module/user/user.routes";
import authRoutes from "./module/auth/auth.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// 404 handler
app.use((req, res, next) => {
    next(new AppError('Not Found', 404));
});

// Error handler
app.use(errorHandler);
