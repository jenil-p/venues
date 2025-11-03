import express from 'express';
import { createUser, validateUserLogin, logOutHelper } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup' , createUser);
router.post('/login' , validateUserLogin);
router.get('/logout' , logOutHelper);

export default router;