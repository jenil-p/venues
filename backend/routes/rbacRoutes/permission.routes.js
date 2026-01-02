import express from "express";
import { assignPermission, deAssignPermission } from "../../controllers/rbacControllers/permission.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/assign-permission", checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "MANAGE_PERMISSION"), assignPermission);

router.patch("/de-assign-permission" , checkForAuthenticationCookie("token"), hasPermission("RolePermission" , "MANAGE_PERMISSION"), deAssignPermission)

export default router;
