import express from 'express'
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { assignRoleToUser , deAssignRoleFromUser } from '../../controllers/adminControllers/userrole.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js"

const router = express.Router();

router.post('/assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "MANAGE_ROLE") , assignRoleToUser , logAction("UserRole" , "MANAGE_ROLE"));
router.patch('/de-assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "MANAGE_ROLE") , deAssignRoleFromUser, logAction("UserRole" , "MANAGE_ROLE"));

export default router;