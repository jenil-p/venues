import express from 'express'

import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js'
import { assignRoleToUser , deAssignRoleFromUser } from '../../controllers/adminControllers/userrole.controller.js';
import { isAdmin } from '../../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/assign-role', checkForAuthenticationCookie("token") , isAdmin , assignRoleToUser);
router.post('/de-assign-role', checkForAuthenticationCookie("token") , isAdmin , deAssignRoleFromUser);

export default router;