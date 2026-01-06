import express from "express";
import { approveServiceP, rejectServiceP, getAllServiceP, getServiveP, deleteServiceP } from "../../controllers/adminControllers/adminServiceP.controller.js"
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { logAction } from "../../middlewares/actionlog.middleware.js";

const router = express.Router();

router.post( "/service-p-requests/:id/approve", checkForAuthenticationCookie("token"), hasPermission("ServiceProvider", "APPROVE"), approveServiceP, logAction("ServiceProvider", "APPROVE"));

router.post( "/service-p-requests/:id/reject", checkForAuthenticationCookie("token"), hasPermission("ServiceProvider", "REJECT"), rejectServiceP, logAction("ServiceProvider", "REJECT"));

router.get("/get-all-service-p" , checkForAuthenticationCookie("token"), hasPermission("ServiceProvider", "VIEW_ALL"), getAllServiceP, logAction("ServiceProvider", "VIEW_ALL"));

router.get("/:hostId" , checkForAuthenticationCookie("token") , hasPermission("HostMaster" , "READ"), getServiveP, logAction("HostMaster" , "READ"));

router.delete("/:hostId" , checkForAuthenticationCookie("token") , hasPermission("HostMaster" , "READ"), deleteServiceP, logAction("HostMaster" , "DELETE"));

export default router;
