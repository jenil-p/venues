import express from "express";
import { createAppTable } from "./apptable.controller.js"
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post("/", checkForAuthenticationCookie("token"), hasPermission("AppTable", "CREATE"), createAppTable, logAction("AppTable", "CREATE"));

export default router;
