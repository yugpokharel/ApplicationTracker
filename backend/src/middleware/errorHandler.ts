import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
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
  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? "Internal server error";

  // Prisma & MongoDB Connection error handling
  if (err.code === "P1001" || err.message?.includes("Can't reach database server") || err.message?.includes("MongoServerError")) {
    statusCode = 503;
    message = "Database connection error. Please check your MongoDB Atlas DATABASE_URL in backend/.env.";
  }

  if (env.isDev) {
    console.error(`[Error] ${statusCode} — ${message}`);
  }

  res.status(statusCode).json({
    error: message,
  });
}
