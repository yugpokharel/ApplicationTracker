import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", environment: env.nodeEnv });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
