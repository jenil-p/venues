import express from 'express';
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { requestProvider, myProviderProfile } from './provider.controller.js';

const router = express.Router();

router.post("/", checkForAuthenticationCookie("token"), requestProvider);
router.get("/me", checkForAuthenticationCookie("token"), myProviderProfile);

export default router;
