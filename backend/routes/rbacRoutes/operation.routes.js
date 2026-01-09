import express from "express";
import { createOperation } from "../../controllers/rbacControllers/operation.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post("/", checkForAuthenticationCookie("token"), hasPermission("Operation" , "CREATE"), createOperation , logAction("Operation" , "CREATE"));

export default router;
