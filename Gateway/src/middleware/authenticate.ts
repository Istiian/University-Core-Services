
import { Request, Response, NextFunction } from 'express';
import './passport';
import passport from 'passport';

export const authenticate = [
    passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as {
            userId: number;
            role: string;
        };
        req.user = user;
        next();
    }
];

