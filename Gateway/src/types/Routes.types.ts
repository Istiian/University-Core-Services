type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RouteConfig = {
    method: HTTPMethod;
    path: string;
};



