import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types";
import { generateHmac } from "../utils/crypto";
import { auditService } from "../services/audit.service";

const prisma = new PrismaClient();

export class TransactionController {
  async createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { amount, currency = "USD", idempotencyKey, description } = req.body;

      // Check for Idempotency Key (replay attack prevention)
      const existingTx = await prisma.transaction.findUnique({
        where: { idempotencyKey },
      });

      if (existingTx) {
        res.status(200).json({
          message: "Transaction already processed (Idempotent response).",
          data: existingTx,
        });
        return;
      }

      // Generate HMAC signature for integrity verification
      const rawPayload = `${userId}:${amount}:${currency}:${idempotencyKey}`;
      const hmacSignature = generateHmac(rawPayload);

      // Perform atomic database transaction with rollback capability
      const transactionResult = await prisma.$transaction(async (tx) => {
        const created = await tx.transaction.create({
          data: {
            userId,
            amount,
            currency,
            idempotencyKey,
            hmacSignature,
            description: description || "Job Insights Premium Plan Subscription",
            status: "COMPLETED",
          },
        });

        return created;
      });

      await auditService.log({
        userId,
        action: "TRANSACTION_COMPLETED",
        status: "SUCCESS",
        details: { transactionId: transactionResult.id, amount, idempotencyKey },
      });

      res.status(201).json({
        message: "Transaction processed securely.",
        data: transactionResult,
      });
    } catch (err: any) {
      await auditService.log({
        userId: req.user?.id,
        action: "TRANSACTION_FAILED",
        status: "FAILURE",
        details: { error: err.message },
      });
      res.status(400).json({ error: err.message || "Transaction processing failed." });
    }
  }

  async listTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      res.json({ data: transactions });
    } catch (err) {
      next(err);
    }
  }
}

export const transactionController = new TransactionController();
