import express from "express";
import { createOperation } from "../../controllers/rbacControllers/operation.controller.js";
import { checkForAuthenticationCookie } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/add-operation", checkForAuthenticationCookie("token"), isAdmin, createOperation);

export default router;
