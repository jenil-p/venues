import express from 'express';

import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { validateProviderServiceOwnership } from '../../middlewares/validateProviderServiceOwnership.middleware.js';

import { listService, updateService } from '../../controllers/serviceControllers/listService.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.post('/' , hasPermission("Service" , "CREATE") , listService);

router.patch('/:serviceId/' , hasPermission("Service", "UPDATE"), validateProviderServiceOwnership, updateService);

export default router;