import rateLimit, {
  RateLimitRequestHandler,
  Options as RateLimitOptions
} from "express-rate-limit";

export const apiRateLimiter = (options: Partial<RateLimitOptions>): RateLimitRequestHandler => {
    return rateLimit(options);
}