import express from "express";
import { createAppTable } from "../../controllers/rbacControllers/apptable.controller.js"
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/add-table", checkForAuthenticationCookie("token"), hasPermission("AppTable" , "CREATE"), createAppTable);

export default router;
