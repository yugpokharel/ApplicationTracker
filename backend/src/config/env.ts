import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env["PORT"] ?? "5000", 10),
  nodeEnv: process.env["NODE_ENV"] ?? "development",
  databaseUrl: getEnv("DATABASE_URL", "mongodb://127.0.0.1:27017/application_tracker?retryWrites=true&w=majority"),
  frontendUrl: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
  jwtSecret: process.env["JWT_SECRET"] ?? "super-secret-jwt-key-change-in-production-32bytes!",
  encryptionKey: process.env["ENCRYPTION_KEY"] ?? "0123456789abcdef0123456789abcdef", // 32 chars hex key for AES-256
  isDev: (process.env["NODE_ENV"] ?? "development") === "development",
};
