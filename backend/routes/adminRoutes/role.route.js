import express from "express"
import { addRole, deleteRole } from '../../controllers/adminControllers/role.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js"

const router = express.Router();

router.post("/", checkForAuthenticationCookie("token"), hasPermission("Role", "CREATE"), addRole, logAction("Role", "CREATE"));

router.delete("/:roleId", checkForAuthenticationCookie("token"), hasPermission("Role", "DELETE"), deleteRole, logAction("Role", "DELETE"));


export default router;