import express from "express";
import { assignPermission, deAssignPermission } from "../../controllers/rbacControllers/permission.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post("/assign-permission", checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "MANAGE_PERMISSION"), assignPermission , logAction("RolePermission" , "MANAGE_PERMISSION"));

router.patch("/de-assign-permission" , checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "MANAGE_PERMISSION"), deAssignPermission, logAction("RolePermission" , "MANAGE_PERMISSION"))

export default router;
