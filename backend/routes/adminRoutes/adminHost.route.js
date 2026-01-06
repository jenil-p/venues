import express from "express";
import { approveHost, rejectHost, getAllHost, getHost, deleteHost } from "../../controllers/adminControllers/adminHost.controller.js";
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.post( "/host-requests/:id/approve", hasPermission("HostMaster", "APPROVE"), approveHost, logAction("HostMaster", "APPROVE"));

router.post( "/host-requests/:id/reject", hasPermission("HostMaster", "REJECT"), rejectHost, logAction("HostMaster", "REJECT"));

router.get("/get-all-hosts" , hasPermission("HostMaster", "VIEW_ALL"), getAllHost, logAction("HostMaster", "VIEW_ALL"))

router.get("/:hostId" , hasPermission("HostMaster" , "READ"), getHost, logAction("HostMaster" , "READ"));

router.delete("/:hostId" , hasPermission("HostMaster" , "DELETE"), deleteHost, logAction("HostMaster" , "DELETE"));

export default router;
