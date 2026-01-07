import express from "express";

import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

import { approveProvider, rejectProvider, getAllProvider, getProvider, deleteProvider } from "../../controllers/adminControllers/adminProvider.controller.js";

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.post( "/provider-requests/:id/approve", hasPermission("ProviderProfile", "APPROVE"), approveProvider, logAction("ProviderProfile", "APPROVE"));

router.post( "/provider-requests/:id/reject", hasPermission("ProviderProfile", "REJECT"), rejectProvider, logAction("ProviderProfile", "REJECT"));

router.get("/get-all-providers" , hasPermission("ProviderProfile", "VIEW_ALL"), getAllProvider, logAction("ProviderProfile", "VIEW_ALL"))

router.get("/:providerId" , hasPermission("ProviderProfile" , "READ"), getProvider, logAction("ProviderProfile" , "READ"));

router.delete("/:providerId" , hasPermission("ProviderProfile" , "DELETE"), deleteProvider, logAction("ProviderProfile" , "DELETE"));

export default router;
