import express from 'express';
import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { requestHost, myRequest } from '../../controllers/venue/hostmaster.controller.js';

const router = express.Router();

router.post("/request", checkForAuthenticationCookie("token") , requestHost);
router.get("/request/me", checkForAuthenticationCookie("token"), myRequest);

export default router;