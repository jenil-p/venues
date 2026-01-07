import express from "express";
import { assignPermission, deAssignPermission } from "../../controllers/rbacControllers/permission.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post("/assign-permission", checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "CREATE"), assignPermission , logAction("RolePermission" , "CREATE"));

router.patch("/de-assign-permission" , checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "DELETE"), deAssignPermission, logAction("RolePermission" , "DELETE"))

export default router;
