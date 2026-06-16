import { Router } from "express";
import applicationRouter from "./application.route";

const router = Router();

router.use("/applications", applicationRouter);

export default router;
