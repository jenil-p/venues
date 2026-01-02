import express from "express"
import { addRole, deleteRole } from '../../controllers/adminControllers/role.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";

const router = express.Router();

router.post('/add-role' , checkForAuthenticationCookie("token") , hasPermission("Role" , "CREATE") , addRole);

router.delete('/delete-role' , checkForAuthenticationCookie("token") , hasPermission("Role" , "DELETE") , deleteRole);

export default router;