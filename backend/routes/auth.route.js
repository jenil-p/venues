import express from 'express';
import { createUser , sendOtp , verifyOtp } from '../controllers/auth.controller.js';
// import { createUser, validateUserLogin, logOutHelper , getUser } from '../controllers/auth.controller.js';
// import { checkForAuthenticationCookie } from '../middlewares/authentication.middleware.js'

const router = express.Router();

router.post('/signup' , createUser);
router.post('/send-otp' , sendOtp);
router.post("/verify-otp", verifyOtp);


// router.post('/login' , validateUserLogin);
// router.get('/logout' , logOutHelper);
// router.get('/getUser' , checkForAuthenticationCookie("token") , getUser);

export default router;