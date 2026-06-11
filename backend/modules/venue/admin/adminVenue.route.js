import express from 'express';

import { checkForAuthenticationCookie } from '../../../middlewares/authentication.middleware.js';
import { hasPermission } from '../../../middlewares/permission.middleware.js';
import { logAction } from '../../../middlewares/actionlog.middleware.js';

import { approveVenue, rejectVenue, getAllVenues, getVenue, deleteVenue } from './adminVenue.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.patch("/:venueId/approval", hasPermission("Venue", "APPROVE"), approveVenue, logAction("Venue", "APPROVE"));

router.delete("/:venueId/approval", hasPermission("Venue", "REJECT"), rejectVenue, logAction("Venue", "REJECT"));

router.get("/", hasPermission("Venue", "VIEW_ALL"), getAllVenues, logAction("Venue", "VIEW_ALL"));

router.get("/:venueId", hasPermission("Venue", "READ"), getVenue, logAction("Venue", "READ"));

router.delete("/:venueId", hasPermission("Venue", "DELETE"), deleteVenue, logAction("Venue", "DELETE"));


export default router;