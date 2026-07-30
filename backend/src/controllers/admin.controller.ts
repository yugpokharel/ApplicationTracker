import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types";
import { auditService } from "../services/audit.service";

const prisma = new PrismaClient();

export class AdminController {
  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isMfaEnabled: true,
          failedLoginAttempts: true,
          lockoutUntil: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ data: users });
    } catch (err) {
      next(err);
    }
  }

  async unlockUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };

      const updated = await prisma.user.update({
        where: { id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
        select: { id: true, email: true, name: true },
      });

      await auditService.log({
        userId: req.user!.id,
        action: "ADMIN_UNLOCK_USER",
        status: "SUCCESS",
        details: { unlockedUserId: id, unlockedEmail: updated.email },
      });

      res.json({ message: `Account for ${updated.email} unlocked successfully.`, data: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Failed to unlock user." });
    }
  }

  async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "50", 10);
      const action = req.query.action as string | undefined;

      const result = await auditService.getLogs(page, limit, action);
      res.json({ data: result.logs, pagination: { page: result.page, totalPages: result.totalPages, total: result.total } });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
