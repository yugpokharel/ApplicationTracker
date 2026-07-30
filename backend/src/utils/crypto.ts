import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../config/env";

const ALGORITHM = "aes-256-gcm";
const SALT_ROUNDS = 12;

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

/**
 * Validates password strength according to security assessment requirements:
 * - Minimum 10 characters
 * - Uppercase letter
 * - Lowercase letter
 * - Number
 * - Special character
 */
export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 10) {
    feedback.push("Password must be at least 10 characters long.");
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain at least one uppercase letter (A-Z).");
  } else {
    score++;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain at least one lowercase letter (a-z).");
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push("Password must contain at least one number (0-9).");
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push("Password must contain at least one special character (!@#$%^&*...).");
  } else {
    score++;
  }

  return {
    isValid: feedback.length === 0,
    score,
    feedback,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * AES-256-GCM encryption for sensitive data fields (e.g., application notes, internal recruiter contacts)
 */
export function encryptText(text: string): string {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(12);
    const key = Buffer.from(env.encryptionKey.padEnd(32, "0").slice(0, 32));
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
}

/**
 * AES-256-GCM decryption
 */
export function decryptText(encryptedPayload: string): string {
  if (!encryptedPayload || !encryptedPayload.includes(":")) return encryptedPayload;
  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) return encryptedPayload;

    const [ivHex, authTagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = Buffer.from(env.encryptionKey.padEnd(32, "0").slice(0, 32));

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // If text was unencrypted originally, return as is
    return encryptedPayload;
  }
}

export function generateHmac(payload: string): string {
  return crypto.createHmac("sha256", env.jwtSecret).update(payload).digest("hex");
}
