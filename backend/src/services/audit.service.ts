import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuditLogOptions {
  userId?: string | null;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: "SUCCESS" | "FAILURE" | "WARNING";
  details?: Record<string, unknown> | string;
}

export class AuditService {
  async log(options: AuditLogOptions): Promise<void> {
    try {
      let sanitizedDetails: string | null = null;
      if (options.details) {
        if (typeof options.details === "string") {
          sanitizedDetails = options.details;
        } else {
          // Remove any sensitive fields before stringifying
          const clone = { ...options.details };
          delete clone.password;
          delete clone.passwordHash;
          delete clone.mfaSecret;
          delete clone.token;
          sanitizedDetails = JSON.stringify(clone);
        }
      }

      await prisma.auditLog.create({
        data: {
          userId: options.userId ?? null,
          action: options.action,
          ipAddress: options.ipAddress ?? null,
          userAgent: options.userAgent ?? null,
          status: options.status,
          details: sanitizedDetails,
        },
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }

  async getLogs(page = 1, limit = 50, actionFilter?: string) {
    const skip = (page - 1) * limit;
    const where = actionFilter ? { action: { contains: actionFilter, mode: "insensitive" as const } } : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const auditService = new AuditService();
