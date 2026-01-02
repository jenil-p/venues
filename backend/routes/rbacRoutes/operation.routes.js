import express from "express";
import { createOperation } from "../../controllers/rbacControllers/operation.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/add-operation", checkForAuthenticationCookie("token"), hasPermission("Operation" , "CREATE"), createOperation);

export default router;
