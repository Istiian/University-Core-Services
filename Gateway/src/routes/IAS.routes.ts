import express from 'express';

import { apiRateLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/authenticate';
import { createProxy } from '../middleware/createProxy';
import { RouteConfig } from '../types/Routes.types';

const router = express.Router();

const proxyIAS = createProxy({
    target: 'http://localhost:3001/IAS'
});

// Login Route 
router.post('/auth/session',
    apiRateLimiter({
        windowMs: 10 * 60 * 1000,
        max: 5,
        message: "Login attempts exceeded. Please try again after 10 minutes.",
    }),
    proxyIAS
);

const protectedRoutes: RouteConfig[] = [
    // <----- Auth Module Routes -----> //
    { method: 'delete', path: '/auth/session' },
    { method: 'patch', path: '/auth/password/change' },
    { method: 'patch', path: '/auth/password/change/:userId' },

    // <----- User Module Routes -----> //
    { method: 'patch', path: '/users/:id' },
    { method: 'get', path: '/users/:id' },
    { method: 'get', path: '/users' }
]

protectedRoutes.forEach(route => {
    router[route.method](route.path, authenticate, proxyIAS);
});

const publicRoutes: RouteConfig[] = [
    { method: 'post', path: '/users' },
    { method: 'post', path: '/auth/token' },
    { method: 'post', path: '/auth/password/reset-request' },
    { method: 'post', path: '/auth/otp/verify' },
    { method: 'post', path: '/auth/password/reset' }
]

publicRoutes.forEach(route => {
    router[route.method](route.path, proxyIAS);
});

export default router;

