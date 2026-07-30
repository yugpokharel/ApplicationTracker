import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { encryptText, decryptText } from "../utils/crypto";
import {
  ApplicationEntity,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ListApplicationsQuery,
} from "../types";

export class ApplicationService {
  async findAll(userId: string, query: ListApplicationsQuery): Promise<ApplicationEntity[]> {
    const where: Prisma.ApplicationWhereInput = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { company_name: { contains: query.search, mode: "insensitive" } },
        { job_title: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const results = await prisma.application.findMany({
      where,
      orderBy: { applied_date: "desc" },
    });

    return results.map((app) => ({
      ...app,
      notes: app.notes ? decryptText(app.notes) : null,
    })) as ApplicationEntity[];
  }

  async findById(userId: string, id: string): Promise<ApplicationEntity | null> {
    // IDOR protection: strictly scope by userId and id
    const result = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!result) return null;

    return {
      ...result,
      notes: result.notes ? decryptText(result.notes) : null,
    } as ApplicationEntity;
  }

  async create(userId: string, dto: CreateApplicationDTO): Promise<ApplicationEntity> {
    const { applied_date, notes, ...rest } = dto;

    const encryptedNotes = notes ? encryptText(notes) : null;

    const result = await prisma.application.create({
      data: {
        ...rest,
        userId,
        applied_date: new Date(applied_date),
        notes: encryptedNotes,
      },
    });

    return {
      ...result,
      notes: notes ?? null,
    } as ApplicationEntity;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateApplicationDTO
  ): Promise<ApplicationEntity | null> {
    // IDOR protection: check ownership first
    const exists = await prisma.application.findFirst({ where: { id, userId } });
    if (!exists) return null;

    const { applied_date, notes, ...rest } = dto;

    const encryptedNotes = notes !== undefined ? (notes ? encryptText(notes) : null) : undefined;

    const result = await prisma.application.update({
      where: { id },
      data: {
        ...rest,
        ...(applied_date ? { applied_date: new Date(applied_date) } : {}),
        ...(encryptedNotes !== undefined ? { notes: encryptedNotes } : {}),
      },
    });

    return {
      ...result,
      notes: result.notes ? decryptText(result.notes) : null,
    } as ApplicationEntity;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    // IDOR protection: check ownership before deleting
    const exists = await prisma.application.findFirst({ where: { id, userId } });
    if (!exists) return false;

    await prisma.application.delete({ where: { id } });
    return true;
  }
}

export const applicationService = new ApplicationService();
