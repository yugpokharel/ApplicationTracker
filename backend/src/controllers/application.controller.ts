import { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service";
import {
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ListApplicationsQuery,
} from "../types";

export class ApplicationController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ListApplicationsQuery;
      const applications = await applicationService.findAll(query);
      res.json({ data: applications, total: applications.length });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const application = await applicationService.findById(id);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateApplicationDTO;
      const application = await applicationService.create(dto);
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body as UpdateApplicationDTO;
      const application = await applicationService.update(id, dto);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await applicationService.delete(id);
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
