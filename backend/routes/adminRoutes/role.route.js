import express from "express"
import { addRole, deleteRole, getAllRoles } from '../../controllers/adminControllers/role.controller.js';
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js"

const router = express.Router();
router.use(checkForAuthenticationCookie("token"))

router.get('/' , hasPermission("Role", "VIEW_ALL") , getAllRoles , logAction("Role", "VIEW_ALL"))

router.post("/", hasPermission("Role", "CREATE"), addRole, logAction("Role", "CREATE"));

router.delete("/:roleId", hasPermission("Role", "DELETE"), deleteRole, logAction("Role", "DELETE"));


export default router;