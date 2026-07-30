import { Router } from "express";
import { applicationController } from "../controllers/application.controller";
import { validate } from "../middleware/validate";
import { authenticateJWT } from "../middleware/auth";
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
  ListQuerySchema,
} from "../validations/application.validation";

const router = Router();

router.use(authenticateJWT);

router.get(
  "/",
  validate(ListQuerySchema, "query"),
  (req, res, next) => applicationController.list(req, res, next)
);

router.get(
  "/:id",
  (req, res, next) => applicationController.getById(req, res, next)
);

router.post(
  "/",
  validate(CreateApplicationSchema),
  (req, res, next) => applicationController.create(req, res, next)
);

router.patch(
  "/:id",
  validate(UpdateApplicationSchema),
  (req, res, next) => applicationController.update(req, res, next)
);

router.delete(
  "/:id",
  (req, res, next) => applicationController.remove(req, res, next)
);

export default router;
