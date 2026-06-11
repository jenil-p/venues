import express from 'express';
import { createUser , sendOtp , verifyOtp, logOutHelper, getUser , deleteUser } from './auth.controller.js';
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';
import { logAction } from '../../middlewares/actionlog.middleware.js';

const router = express.Router();

router.post('/signup' , createUser);

router.post('/otp' , sendOtp);
router.post("/otp/verify", verifyOtp);

router.get('/logout' , logOutHelper);

router.get('/me' , checkForAuthenticationCookie("token") , getUser);

router.delete('/:userId' , checkForAuthenticationCookie("token") , hasPermission("User" , "DELETE") , deleteUser , logAction("User" , "DELETE" , "userId"));

export default router;