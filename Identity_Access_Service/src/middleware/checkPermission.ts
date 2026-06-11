import { db } from "../db/client";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const checkPermission = (...permissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userIdHeader = req.headers['x-user-id'];
           
            if (!userIdHeader) {
                throw new AppError('Unauthorized', 401);
            }
            const userId = parseInt(userIdHeader as string, 10);
            
            if (Number.isNaN(userId)) {
                throw new AppError('Invalid user ID', 401);
            }
            
            const userRecord = await db.query.user.findFirst({
                where: eq(user.userId, userId),
            });

            if (!userRecord) {
                throw new AppError('User not found', 404);
            }

            if (!permissions.includes(userRecord.role)) {
                throw new AppError('Forbidden: Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}