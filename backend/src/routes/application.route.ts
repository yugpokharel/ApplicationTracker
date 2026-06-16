import { Router } from "express";
import { applicationController } from "../controllers/application.controller";
import { validate } from "../middleware/validate";
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
  ListQuerySchema,
} from "../validations/application.validation";

const router = Router();

router.get(
  "/",
  validate(ListQuerySchema, "query"),
  applicationController.list.bind(applicationController)
);

router.get("/:id", applicationController.getById.bind(applicationController));

router.post(
  "/",
  validate(CreateApplicationSchema),
  applicationController.create.bind(applicationController)
);

router.patch(
  "/:id",
  validate(UpdateApplicationSchema),
  applicationController.update.bind(applicationController)
);

router.delete("/:id", applicationController.remove.bind(applicationController));

export default router;
