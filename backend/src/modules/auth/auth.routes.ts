import {Router} from "express";
import {loginHandler, logoutHandler, refreshTokenHandler,changePasswordHandler, sendOTPHandler, resetPasswordHandler} from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginSchema, requestPasswordResetSchema, resetPasswordSchema, changePasswordSchema } from "./auth.validator";
import passport from "passport";


const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.post('/refresh-token', refreshTokenHandler);
router.post('/send-otp', validateRequest(requestPasswordResetSchema), sendOTPHandler);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPasswordHandler);
router.post('/change-password', passport.authenticate('jwt', { session: false }),validateRequest(changePasswordSchema), changePasswordHandler);

export default router;