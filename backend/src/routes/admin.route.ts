import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticateJWT, requireRole } from "../middleware/auth";

const router = Router();

// Protect all admin endpoints with JWT authentication and strict RBAC ADMIN check
router.use(authenticateJWT);
router.use(requireRole(["ADMIN"]));

router.get("/users", (req, res, next) => adminController.getUsers(req, res, next));
router.post("/users/:id/unlock", (req, res, next) => adminController.unlockUser(req, res, next));
router.get("/logs", (req, res, next) => adminController.getAuditLogs(req, res, next));

export default router;
