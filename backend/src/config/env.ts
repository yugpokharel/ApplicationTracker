import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env["PORT"] ?? "5000", 10),
  nodeEnv: process.env["NODE_ENV"] ?? "development",
  databaseUrl: requireEnv("DATABASE_URL"),
  frontendUrl: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
  isDev: (process.env["NODE_ENV"] ?? "development") === "development",
};
