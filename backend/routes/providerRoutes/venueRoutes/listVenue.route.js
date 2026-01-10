import express from 'express';

import { checkForAuthenticationCookie } from "../../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../../middlewares/permission.middleware.js";

import { listVenue } from "../../../controllers/providerControllers/venueControllers/listVenue.controller.js"

const router = express.Router();

router.post('/' , checkForAuthenticationCookie("token") , hasPermission("Venue" , "CREATE") , listVenue);

export default router;