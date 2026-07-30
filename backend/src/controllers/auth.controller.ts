import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const result = await authService.register(email, password, name, ip, userAgent);
      res.status(201).json({ data: result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, mfaCode } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const result = await authService.login(email, password, mfaCode, ip, userAgent);

      if (result.mfaRequired) {
        res.status(200).json({
          mfaRequired: true,
          message: "Multi-Factor Authentication code required.",
          data: { userId: result.userId, email: result.email },
        });
        return;
      }

      res.json({ data: result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({ data: { user: req.user } });
    } catch (err) {
      next(err);
    }
  }

  async mfaSetup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const setupData = await authService.setupMfa(userId);
      res.json({ data: setupData });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async mfaVerify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { secret, token } = req.body;

      await authService.verifyAndEnableMfa(userId, secret, token);
      res.json({ message: "Multi-Factor Authentication enabled successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async mfaDisable(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await authService.disableMfa(userId);
      res.json({ message: "Multi-Factor Authentication disabled successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const authController = new AuthController();
