import { Request, Response, NextFunction } from "express";
import { db } from "../db/client";
import { permissionRoles } from "../db/PermissionRole";
import { verifyAccessToken } from "../modules/auth/auth.utils";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { AppError } from "../middleware/app-error";
import logger from "../../logger";

export const hasPermission = (...permission: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new AppError('Unauthorized', 401);
            }

            const tokenCredentials = verifyAccessToken(token);

            const userPermissions = await db.query.permissionRoles.findMany({
                where: eq(permissionRoles.roleId, tokenCredentials.role),
                with: {
                    permission: {
                        columns: {
                            name: true,
                        }
                    }
                }
            });

            const permissionNames = userPermissions.map(up => up.permission.name);
            const hasRequiredPermission = userPermissions.some(up => permission.includes(up.permission.name));

            logger.debug('Permission check', {
                personId: tokenCredentials.personId,
                required: permission,
                granted: permissionNames,
                allowed: hasRequiredPermission,
            });

            if (!hasRequiredPermission) {
                logger.warn('Permission denied', {
                    personId: tokenCredentials.personId,
                    required: permission,
                });
                throw new AppError('Forbidden', 403);
            }

            next();
        } catch (error) {
            if (error instanceof AppError) {
                return next(error);
            }
            logger.error('Permission middleware error:', error);
            return next(new AppError('Internal server error', 500));
        }
    }
}
