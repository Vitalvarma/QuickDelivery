import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { sendOtp,verifyOtp } from "../controllers/otp.controller.js";

const router=Router();

router.post('/send',isAuthenticated, sendOtp);
router.post('/verify',isAuthenticated, verifyOtp);

export default router;