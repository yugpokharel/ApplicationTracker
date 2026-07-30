import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticateJWT } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import { RegisterSchema, LoginSchema, MfaVerifySchema } from "../validations/auth.validation";

const router = Router();

// Public auth endpoints protected by strict rate limiting
router.post("/register", authRateLimiter, validate(RegisterSchema), (req, res, next) => authController.register(req, res, next));
router.post("/login", authRateLimiter, validate(LoginSchema), (req, res, next) => authController.login(req, res, next));

// Authenticated auth endpoints
router.get("/me", authenticateJWT, (req, res, next) => authController.me(req, res, next));
router.post("/mfa/setup", authenticateJWT, (req, res, next) => authController.mfaSetup(req, res, next));
router.post("/mfa/verify", authenticateJWT, validate(MfaVerifySchema), (req, res, next) => authController.mfaVerify(req, res, next));
router.post("/mfa/disable", authenticateJWT, (req, res, next) => authController.mfaDisable(req, res, next));

export default router;
