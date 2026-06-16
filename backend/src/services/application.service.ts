import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import {
  ApplicationEntity,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ListApplicationsQuery,
} from "../types";

export class ApplicationService {
  async findAll(query: ListApplicationsQuery): Promise<ApplicationEntity[]> {
    const where: Prisma.ApplicationWhereInput = {};

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

    return results as ApplicationEntity[];
  }

  async findById(id: string): Promise<ApplicationEntity | null> {
    const result = await prisma.application.findUnique({ where: { id } });
    return result as ApplicationEntity | null;
  }

  async create(dto: CreateApplicationDTO): Promise<ApplicationEntity> {
    const { applied_date, ...rest } = dto;
    const result = await prisma.application.create({
      data: {
        ...rest,
        applied_date: new Date(applied_date),
      },
    });
    return result as ApplicationEntity;
  }

  async update(
    id: string,
    dto: UpdateApplicationDTO
  ): Promise<ApplicationEntity | null> {
    const exists = await prisma.application.findUnique({ where: { id } });
    if (!exists) return null;

    const { applied_date, ...rest } = dto;

    const result = await prisma.application.update({
      where: { id },
      data: {
        ...rest,
        ...(applied_date ? { applied_date: new Date(applied_date) } : {}),
      },
    });
    return result as ApplicationEntity;
  }

  async delete(id: string): Promise<boolean> {
    const exists = await prisma.application.findUnique({ where: { id } });
    if (!exists) return false;

    await prisma.application.delete({ where: { id } });
    return true;
  }
}

export const applicationService = new ApplicationService();
