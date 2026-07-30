import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { validate } from "../middleware/validate";
import { authenticateJWT } from "../middleware/auth";
import { UpdateProfileSchema, ChangePasswordSchema } from "../validations/auth.validation";

const router = Router();

router.use(authenticateJWT);

router.get("/", (req, res, next) => profileController.getProfile(req, res, next));
router.patch("/", validate(UpdateProfileSchema), (req, res, next) => profileController.updateProfile(req, res, next));
router.post("/change-password", validate(ChangePasswordSchema), (req, res, next) => profileController.changePassword(req, res, next));
router.get("/export", (req, res, next) => profileController.exportData(req, res, next));
router.post("/import", (req, res, next) => profileController.importData(req, res, next));
router.delete("/account", (req, res, next) => profileController.deleteAccount(req, res, next));

export default router;
