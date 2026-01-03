import express from "express";
import { approveHost, rejectHost, getAllHost } from "../../controllers/adminControllers/adminHost.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post( "/host-requests/:id/approve", checkForAuthenticationCookie("token"), hasPermission("HostMaster", "APPROVE"), approveHost, logAction("HostMaster", "APPROVE"));

router.post( "/host-requests/:id/reject", checkForAuthenticationCookie("token"), hasPermission("HostMaster", "REJECT"), rejectHost, logAction("HostMaster", "REJECT"));

router.get("/get-all-hosts" , checkForAuthenticationCookie("token"), hasPermission("HostMaster", "VIEW_ALL"), getAllHost, logAction("HostMaster", "VIEW_ALL"))

export default router;
