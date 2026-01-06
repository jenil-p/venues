import express from 'express';

import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';
import { logAction } from '../../middlewares/actionlog.middleware.js';

import { seeAllUsers, addAdmin, removeAdmin, seeAllAdmins } from '../../controllers/adminControllers/admin.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.get('/users', hasPermission("User", "VIEW_ALL"), seeAllUsers, logAction("User", "VIEW_ALL"));

router.get('/admins', hasPermission("UserRole", "VIEW_ALL") , seeAllAdmins , logAction("UserRole" , "VIEW_ALL"));

router.post('/make-admin/:userId', hasPermission("UserRole", "ADD_ADMIN"), addAdmin, logAction("UserRole",
    "ADD_ADMIN"));// super admin functionality

router.delete('/delete-admin/:userId', hasPermission("UserRole", "REMOVE_ADMIN"), removeAdmin, logAction("UserRole", "DELETE_ADMIN"));// super admin functionality


export default router;