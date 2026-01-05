import express from "express";
import { approveHost, rejectHost, getAllHost, getHost, deleteHost } from "../../controllers/adminControllers/adminHost.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post( "/host-requests/:id/approve", checkForAuthenticationCookie("token"), hasPermission("HostMaster", "APPROVE"), approveHost, logAction("HostMaster", "APPROVE"));

router.post( "/host-requests/:id/reject", checkForAuthenticationCookie("token"), hasPermission("HostMaster", "REJECT"), rejectHost, logAction("HostMaster", "REJECT"));

router.get("/get-all-hosts" , checkForAuthenticationCookie("token"), hasPermission("HostMaster", "VIEW_ALL"), getAllHost, logAction("HostMaster", "VIEW_ALL"))

router.get("/:hostId" , checkForAuthenticationCookie("token") , hasPermission("HostMaster" , "READ"), getHost, logAction("HostMaster" , "READ"));

router.delete("/:hostId" , checkForAuthenticationCookie("token") , hasPermission("HostMaster" , "READ"), deleteHost, logAction("HostMaster" , "DELETE"));

export default router;
