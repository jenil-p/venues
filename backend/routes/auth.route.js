import express from 'express';
import { createUser , sendOtp , verifyOtp, logOutHelper, getUser , deleteUser } from '../controllers/auth.controller.js';
import { checkForAuthenticationCookie } from '../middlewares/authentication.middleware.js';
import { hasPermission } from '../middlewares/permission.middleware.js';
import { logAction } from '../middlewares/actionlog.middleware.js';

const router = express.Router();

router.post('/signup' , createUser);

router.post('/send-otp' , sendOtp);
router.post("/verify-otp", verifyOtp);

router.get('/logout' , logOutHelper);

router.get('/get-user' , checkForAuthenticationCookie("token") , getUser);

router.delete('/delete-user/:userId' , checkForAuthenticationCookie("token") , hasPermission("User" , "DELETE") , deleteUser , logAction("User" , "DELETE" , "userId"));

export default router;