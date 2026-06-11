import express from 'express';

import { checkForAuthenticationCookie } from "../../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../../middlewares/permission.middleware.js";

import { createFullVenue } from "./listVenue.controller.js"

const router = express.Router();

router.post('/' , checkForAuthenticationCookie("token") , hasPermission("Venue" , "CREATE") , createFullVenue);

export default router;