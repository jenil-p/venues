import express from 'express';

import { checkForAuthenticationCookie } from '../middlewares/authentication.middleware.js';
import { isAdmin, isProvider } from '../controllers/roleCheck.controller.js';

const router = express.Router();

router.get('/isadmin' , checkForAuthenticationCookie('token') , isAdmin);

router.get('/isprovider' , checkForAuthenticationCookie('token') , isProvider);

export default router;