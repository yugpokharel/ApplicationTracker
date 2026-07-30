import { Router } from "express";
import applicationRouter from "./application.route";
import authRouter from "./auth.route";
import profileRouter from "./profile.route";
import transactionRouter from "./transaction.route";
import adminRouter from "./admin.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/applications", applicationRouter);
router.use("/transactions", transactionRouter);
router.use("/admin", adminRouter);

export default router;
