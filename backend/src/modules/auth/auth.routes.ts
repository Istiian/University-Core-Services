import {Router} from "express";
import {loginHandler, logoutHandler, refreshTokenHandler, sendOTPHandler, resetPasswordHandler} from "./auth.controller";

const router = Router();

router.post('/login', loginHandler);
router.post('/logout', logoutHandler);
router.post('/refresh-token', refreshTokenHandler);
router.post('/send-otp', sendOTPHandler);
router.post('/reset-password', resetPasswordHandler);

export default router;