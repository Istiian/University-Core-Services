import httpProxy, { ServerOptions } from 'http-proxy';
import { Request, Response, NextFunction } from 'express';

const proxy = httpProxy.createProxyServer();

proxy.on('proxyReq', (proxyReq, req) => {
    const user = (req as Request).user as
        | {
              userId: number;
              role: string;
          }
        | undefined;

    if (user) {
        proxyReq.setHeader('x-user-id', String(user.userId));
        proxyReq.setHeader('x-user-role', user.role);
    }
});

export const createProxy = (options: ServerOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        proxy.web(req, res, options, next);
    };
};