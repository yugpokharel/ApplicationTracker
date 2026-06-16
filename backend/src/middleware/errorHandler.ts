import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}

export function globalErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  if (env.isDev) {
    console.error(`[Error] ${statusCode} — ${message}`, err.stack);
  }

  res.status(statusCode).json({
    error: message,
    ...(env.isDev && { stack: err.stack }),
  });
}
