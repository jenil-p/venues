import express from "express";

import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

import { approveProvider, rejectProvider, getAllProvider, getProvider, deleteProvider } from "../../controllers/adminControllers/adminProvider.controller.js";

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.patch("/:providerId/approval", hasPermission("ProviderProfile", "APPROVE"), approveProvider, logAction("ProviderProfile", "APPROVE"));

router.delete("/:providerId/approval", hasPermission("ProviderProfile", "REJECT"), rejectProvider, logAction("ProviderProfile", "REJECT"));

router.get("/", hasPermission("ProviderProfile", "VIEW_ALL"), getAllProvider, logAction("ProviderProfile", "VIEW_ALL"));

router.get("/:providerId", hasPermission("ProviderProfile", "READ"), getProvider, logAction("ProviderProfile", "READ"));

router.delete("/:providerId", hasPermission("ProviderProfile", "DELETE"), deleteProvider, logAction("ProviderProfile", "DELETE"));


export default router;
