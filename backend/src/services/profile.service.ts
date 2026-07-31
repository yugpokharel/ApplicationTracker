import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, validatePasswordPolicy, encryptText, decryptText } from "../utils/crypto";
import { auditService } from "./audit.service";

const prisma = new PrismaClient();

export class ProfileService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isMfaEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new Error("User profile not found.");

    const stats = {
      totalApplications: await prisma.application.count({ where: { userId } }),
      auditLogCount: await prisma.auditLog.count({ where: { userId } }),
    };

    return { ...user, stats };
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isMfaEnabled: true,
      },
    });

    await auditService.log({
      userId,
      action: "PROFILE_UPDATED",
      status: "SUCCESS",
      details: { updatedFields: Object.keys(data) },
    });

    return user;
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found.");

    const isValid = await comparePassword(currentPass, user.passwordHash);
    if (!isValid) throw new Error("Current password is incorrect.");

    const policyCheck = validatePasswordPolicy(newPass);
    if (!policyCheck.isValid) {
      throw new Error(`Password policy violation: ${policyCheck.feedback.join(" ")}`);
    }

    const newHash = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await auditService.log({
      userId,
      action: "PASSWORD_CHANGED",
      status: "SUCCESS",
    });

    return true;
  }

  /**
   * Data Portability / GDPR Export
   * Returns complete JSON export of user profile, job applications, and security log metadata.
   */
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isMfaEnabled: true,
        createdAt: true,
      },
    });

    const rawApplications = await prisma.application.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });

    const applications = rawApplications.map((app) => ({
      ...app,
      notes: app.notes ? decryptText(app.notes) : null,
    }));

    const auditLogs = await prisma.auditLog.findMany({
      where: { userId },
      take: 100,
      orderBy: { createdAt: "desc" },
      select: {
        action: true,
        status: true,
        createdAt: true,
        ipAddress: true,
      },
    });

    await auditService.log({
      userId,
      action: "GDPR_DATA_EXPORTED",
      status: "SUCCESS",
    });

    return {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        format: "GDPR_COMPLIANT_JSON",
      },
      user,
      applications,
      auditLogs,
    };
  }

  /**
   * Data Portability / GDPR Import
   * Imports array of job applications for the user.
   */
  async importUserData(userId: string, applicationsData: Array<{ company_name: string; job_title: string; job_type: string; status: string; applied_date: string; notes?: string }>) {
    if (!Array.isArray(applicationsData)) {
      throw new Error("Invalid import format. Expected an array of job applications.");
    }

    const createdRecords = [];
    for (const app of applicationsData) {
      if (!app.company_name || !app.job_title) continue;

      const record = await prisma.application.create({
        data: {
          userId,
          company_name: app.company_name,
          job_title: app.job_title,
          job_type: (app.job_type as any) || "FullTime",
          status: (app.status as any) || "Applied",
          applied_date: app.applied_date ? new Date(app.applied_date) : new Date(),
          notes: app.notes ? encryptText(app.notes) : null,
        },
      });
      createdRecords.push(record);
    }

    await auditService.log({
      userId,
      action: "GDPR_DATA_IMPORTED",
      status: "SUCCESS",
      details: { count: createdRecords.length },
    });

    return { count: createdRecords.length };
  }

  /**
   * Account Erasure / Right to be Forgotten
   */
  async deleteAccount(userId: string, password?: string) {
    if (!password) {
      const error: any = new Error("Current password is required to delete account.");
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

    await prisma.user.delete({ where: { id: userId } });

    await auditService.log({
      action: "ACCOUNT_DELETED",
      status: "SUCCESS",
      details: { userId },
    });

    return true;
  }
}

export const profileService = new ProfileService();
