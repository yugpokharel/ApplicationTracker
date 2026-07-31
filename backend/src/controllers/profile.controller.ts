import { Response, NextFunction } from "express";
import { profileService } from "../services/profile.service";
import { AuthenticatedRequest } from "../types";

export class ProfileController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await profileService.getProfile(userId);
      res.json({ data: profile });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await profileService.updateProfile(userId, req.body);
      res.json({ data: profile });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await profileService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: "Password updated successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async exportData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const exportData = await profileService.exportUserData(userId);
      res.json({ data: exportData });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async importData(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { applications } = req.body;
      const result = await profileService.importUserData(userId, applications);
      res.json({ message: `Successfully imported ${result.count} job application(s).`, data: result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { password, currentPassword } = req.body || {};
      const pwd = password || currentPassword;

      await profileService.deleteAccount(userId, pwd);
      res.json({ message: "Account and associated data deleted successfully." });
    } catch (err: any) {
      const statusCode = err.statusCode || 400;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

export const profileController = new ProfileController();
