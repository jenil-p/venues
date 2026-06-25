import express from 'express';
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { requestProvider, myProviderProfile, getProviderInfo } from './provider.controller.js';

const router = express.Router();

router.post("/", checkForAuthenticationCookie("token"), requestProvider);
router.get("/me", checkForAuthenticationCookie("token"), myProviderProfile);

router.get("/:providerId", checkForAuthenticationCookie("token"), getProviderInfo);

export default router;
