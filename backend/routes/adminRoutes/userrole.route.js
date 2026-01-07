import express from 'express'
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { assignRoleToUser , deAssignRoleFromUser } from '../../controllers/adminControllers/userrole.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js"

const router = express.Router();

router.post('/assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "CREATE") , assignRoleToUser , logAction("UserRole" , "CREATE"));
router.patch('/de-assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "DELETE") , deAssignRoleFromUser, logAction("UserRole" , "DELETE"));

export default router;