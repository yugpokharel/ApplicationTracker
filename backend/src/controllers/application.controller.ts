import { Response, NextFunction } from "express";
import { applicationService } from "../services/application.service";
import {
  AuthenticatedRequest,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ListApplicationsQuery,
} from "../types";

export class ApplicationController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as ListApplicationsQuery;
      const applications = await applicationService.findAll(userId, query);
      res.json({ data: applications, total: applications.length });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const application = await applicationService.findById(userId, id);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dto = req.body as CreateApplicationDTO;
      const application = await applicationService.create(userId, dto);
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const dto = req.body as UpdateApplicationDTO;
      const application = await applicationService.update(userId, id, dto);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const deleted = await applicationService.delete(userId, id);
      if (!deleted) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json({ message: "Application deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export const applicationController = new ApplicationController();
