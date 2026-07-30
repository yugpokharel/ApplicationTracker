import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";
import { generalRateLimiter } from "./middleware/rateLimiter";

const app = express();

// Security headers and proxy settings
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.frontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting across all API routes
app.use("/api", generalRateLimiter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
