import express from "express";
import { createAppTable } from "../../controllers/rbacControllers/apptable.controller.js"
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { isAdmin } from "../../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/add-table", checkForAuthenticationCookie("token"), isAdmin, createAppTable);

export default router;
