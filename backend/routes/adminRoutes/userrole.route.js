import express from 'express'
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { assignRoleToUser , deAssignRoleFromUser } from '../../controllers/adminControllers/userrole.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.post('/assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "MANAGE_ROLE") , assignRoleToUser);
router.patch('/de-assign-role', checkForAuthenticationCookie("token") , hasPermission("UserRole" , "MANAGE_ROLE") , deAssignRoleFromUser);

export default router;