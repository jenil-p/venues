import express from 'express';

import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';
import { logAction } from '../../middlewares/actionlog.middleware.js';

import { approveService, rejectService, getAllServices, getService, deleteService } from '../../controllers/adminControllers/adminService.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.post( "/service-req/:serviceId/approve", hasPermission("Service", "APPROVE"), approveService, logAction("Service", "APPROVE"));

router.post( "/service-req/:serviceId/reject", hasPermission("Service", "REJECT"), rejectService, logAction("Service", "REJECT"));

router.get("/services" , hasPermission("Service", "VIEW_ALL"), getAllServices, logAction("Service", "VIEW_ALL"))

router.get("/:serviceId" , hasPermission("Service" , "READ"), getService, logAction("Service" , "READ"));

router.delete("/:serviceId" , hasPermission("Service" , "READ"), deleteService, logAction("Service" , "DELETE"));

export default router;