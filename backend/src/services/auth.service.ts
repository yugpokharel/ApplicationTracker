import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { hashPassword, comparePassword, validatePasswordPolicy } from "../utils/crypto";
import { generateMfaSecret, verifyMfaToken, MfaSetupData } from "../utils/mfa";
import { auditService } from "./audit.service";
import { UserPayload } from "../types";

const prisma = new PrismaClient();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export class AuthService {
  async register(email: string, password: string, name: string, ipAddress?: string, userAgent?: string) {
    const passwordCheck = validatePasswordPolicy(password);
    if (!passwordCheck.isValid) {
      throw new Error(`Password policy violation: ${passwordCheck.feedback.join(" ")}`);
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      await auditService.log({
        action: "AUTH_REGISTER_FAILED",
        ipAddress,
        userAgent,
        status: "FAILURE",
        details: { email, reason: "Email already registered" },
      });
      throw new Error("Email is already registered.");
    }

    const passwordHash = await hashPassword(password);
    // First registered user gets ADMIN role for convenience, others get USER
    const userCount = await prisma.user.count();
    const role: Role = userCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name,
        role,
      },
    });

    await auditService.log({
      userId: user.id,
      action: "AUTH_REGISTER_SUCCESS",
      ipAddress,
      userAgent,
      status: "SUCCESS",
      details: { email: user.email, role: user.role },
    });

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isMfaEnabled: user.isMfaEnabled,
      },
      token,
    };
  }

  async login(email: string, password: string, mfaCode?: string, ipAddress?: string, userAgent?: string) {
    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      await auditService.log({
        action: "AUTH_LOGIN_FAILED",
        ipAddress,
        userAgent,
        status: "FAILURE",
        details: { email: cleanEmail, reason: "User not found" },
      });
      throw new Error("Invalid credentials.");
    }

    // Check account lockout status
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMins = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      await auditService.log({
        userId: user.id,
        action: "AUTH_LOGIN_BLOCKED_LOCKOUT",
        ipAddress,
        userAgent,
        status: "WARNING",
        details: { email: cleanEmail, remainingMins },
      });
      throw new Error(`Account locked due to multiple failed attempts. Try again in ${remainingMins} minute(s).`);
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      const attempts = user.failedLoginAttempts + 1;
      let lockoutUntil: Date | null = user.lockoutUntil;

      if (attempts >= LOCKOUT_THRESHOLD) {
        lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockoutUntil,
        },
      });

      await auditService.log({
        userId: user.id,
        action: "AUTH_LOGIN_FAILED",
        ipAddress,
        userAgent,
        status: "FAILURE",
        details: { email: cleanEmail, attempts, lockedOut: !!lockoutUntil },
      });

      if (lockoutUntil) {
        throw new Error(`Account locked due to 5 consecutive failed attempts. Locked for ${LOCKOUT_DURATION_MINUTES} minutes.`);
      }

      throw new Error("Invalid credentials.");
    }

    // Reset failed login attempts on valid password
    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockoutUntil: null },
      });
    }

    // Handle MFA / 2FA verification if enabled
    if (user.isMfaEnabled) {
      if (!mfaCode) {
        return {
          mfaRequired: true,
          userId: user.id,
          email: user.email,
        };
      }

      if (!user.mfaSecret) {
        throw new Error("MFA secret configuration missing.");
      }

      const isValidMfa = verifyMfaToken(mfaCode, user.mfaSecret);
      if (!isValidMfa) {
        await auditService.log({
          userId: user.id,
          action: "AUTH_MFA_FAILED",
          ipAddress,
          userAgent,
          status: "FAILURE",
        });
        throw new Error("Invalid 6-digit Multi-Factor Authentication code.");
      }
    }

    await auditService.log({
      userId: user.id,
      action: "AUTH_LOGIN_SUCCESS",
      ipAddress,
      userAgent,
      status: "SUCCESS",
    });

    const token = this.generateToken(user);

    return {
      mfaRequired: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isMfaEnabled: user.isMfaEnabled,
      },
      token,
    };
  }

  async setupMfa(userId: string): Promise<MfaSetupData> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found.");

    return generateMfaSecret(user.email);
  }

  async verifyAndEnableMfa(userId: string, secret: string, token: string): Promise<boolean> {
    const isValid = verifyMfaToken(token, secret);
    if (!isValid) {
      throw new Error("Invalid TOTP verification code.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: secret,
        isMfaEnabled: true,
      },
    });

    await auditService.log({
      userId,
      action: "AUTH_MFA_ENABLED",
      status: "SUCCESS",
    });

    return true;
  }

  async disableMfa(userId: string, password?: string): Promise<boolean> {
    if (!password) {
      const error: any = new Error("Current password is required to disable MFA.");
      error.statusCode = 401;
      throw error;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error: any = new Error("User not found.");
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      const error: any = new Error("Incorrect password.");
      error.statusCode = 401;
      throw error;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: null,
        isMfaEnabled: false,
      },
    });

    await auditService.log({
      userId,
      action: "AUTH_MFA_DISABLED",
      status: "SUCCESS",
    });

    return true;
  }


  private generateToken(user: { id: string; email: string; name: string; role: Role; isMfaEnabled: boolean }): string {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isMfaEnabled: user.isMfaEnabled,
    };

    return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
  }
}

export const authService = new AuthService();
