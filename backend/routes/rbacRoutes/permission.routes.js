import express from "express";
import { assignPermission } from "../../controllers/rbacControllers/permission.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { isAdmin } from "../../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/assign-permission", checkForAuthenticationCookie("token"), isAdmin, assignPermission);

export default router;
