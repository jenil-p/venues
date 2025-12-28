import express from 'express';
import { createUser , sendOtp , verifyOtp, logOutHelper, getUser , deleteUser } from '../controllers/auth.controller.js';
import { checkForAuthenticationCookie } from '../middlewares/authentication.middleware.js'

const router = express.Router();

router.post('/signup' , createUser);

router.post('/send-otp' , sendOtp);
router.post("/verify-otp", verifyOtp);

router.get('/logout' , logOutHelper);

router.get('/get-user' , checkForAuthenticationCookie("token") , getUser);

router.delete('/delete-user' , deleteUser);

export default router;