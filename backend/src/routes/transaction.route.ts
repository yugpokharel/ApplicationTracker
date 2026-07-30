import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";
import { validate } from "../middleware/validate";
import { authenticateJWT } from "../middleware/auth";
import { TransactionSchema } from "../validations/auth.validation";

const router = Router();

router.use(authenticateJWT);

router.post("/", validate(TransactionSchema), (req, res, next) => transactionController.createTransaction(req, res, next));
router.get("/", (req, res, next) => transactionController.listTransactions(req, res, next));

export default router;
