import { Router } from "express";
import {
    loginHandler,
    refreshTokenHandler,
    logoutHandler,
    requestOTPHandler,
    verifyOTPHandler,
    resetPasswordHandler,
    changePasswordHandler,
} from "./auth.controller";

const router = Router();

// Login 
router.post('/session',
    loginHandler);

// Logout
router.delete('/session', 
    logoutHandler);

// Token refresh
router.post('/token', 
    refreshTokenHandler);


router.post('/password/reset-request', 
    requestOTPHandler);

// Verify OTP
router.post('/otp/verify', 
    verifyOTPHandler);

// Reset password
router.post('/password/reset', 
    resetPasswordHandler);

// Change password
router.patch('/password/change', 
    changePasswordHandler);

export default router;
