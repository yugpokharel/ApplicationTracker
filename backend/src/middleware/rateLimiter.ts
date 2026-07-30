import rateLimit from "express-rate-limit";

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // strict limit: 10 requests per 15 minutes on auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many failed login or authentication attempts. Please try again after 15 minutes.",
  },
});
