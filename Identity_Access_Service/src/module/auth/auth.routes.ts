import { Router } from "express";
import {
    loginHandler,
    refreshTokenHandler,
    logoutHandler,
    requestOTPHandler,
    verifyOTPHandler,
    resetPasswordHandler,
    changePasswordHandler,
    changePasswordHandlerForAdmin,
} from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { 
    changePasswordSchema,
    loginSchema, 
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyOTPSchema,
} from "./auth.validator";

const router = Router();

// Login 
router.post('/session',
    validateRequest(loginSchema),
    loginHandler);

// Logout
router.delete('/session', 
    logoutHandler);

// Token refresh
router.post('/token', 
    refreshTokenHandler);

// Request password reset OTP
router.post('/password/reset-request',
    validateRequest(requestPasswordResetSchema),
    requestOTPHandler);

// Verify OTP
router.post('/otp/verify', 
    validateRequest(verifyOTPSchema),
    verifyOTPHandler);

// Reset password
router.post('/password/reset', 
    validateRequest(resetPasswordSchema),
    resetPasswordHandler);

// Change password
router.patch('/password/change',
    validateRequest(changePasswordSchema),
    changePasswordHandler);

// Change password with userId in path (for admin use)
router.patch('/password/change/:userId',
    validateRequest(changePasswordSchema),
    changePasswordHandlerForAdmin);

export default router;
