import {Router} from "express";
import {loginHandler, logoutHandler, refreshTokenHandler, sendOTPHandler, resetPasswordHandler} from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginSchema, requestPasswordResetSchema, resetPasswordSchema } from "./auth.validator";
const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.post('/refresh-token', refreshTokenHandler);
router.post('/send-otp', validateRequest(requestPasswordResetSchema), sendOTPHandler);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPasswordHandler);

export default router;