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
    adminChangePasswordSchema,
    loginSchema, 
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyOTPSchema,
} from "./auth.validator";
import {checkPermission} from "../../middleware/checkPermission";

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
    checkPermission('SuperAdmin', 'Self'),
    validateRequest(changePasswordSchema),
    changePasswordHandler);

// Change password with userId in path (for admin use)
router.patch('/password/change/:userId',
    checkPermission('SuperAdmin', 'Self'),
    validateRequest(adminChangePasswordSchema),
    changePasswordHandlerForAdmin);

export default router;
