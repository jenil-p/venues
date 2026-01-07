import express from 'express';
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { requestProvider, myProviderProfile } from '../../controllers/providerControllers/provider.controller.js';

const router = express.Router();

router.post("/request", checkForAuthenticationCookie("token"), requestProvider);
router.get("/request/me", checkForAuthenticationCookie("token"), myProviderProfile);

export default router;
