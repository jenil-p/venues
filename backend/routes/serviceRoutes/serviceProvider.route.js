import express from 'express';
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { requestServiceProvider, myRequestServicProvider } from '../../controllers/serviceControllers/serviceProvider.controller.js';

const router = express.Router();

router.post("/request", checkForAuthenticationCookie("token") , requestServiceProvider);
router.get("/request/me", checkForAuthenticationCookie("token"), myRequestServicProvider);

export default router;