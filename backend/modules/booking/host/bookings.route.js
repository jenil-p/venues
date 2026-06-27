import express from 'express';
import { checkForAuthenticationCookie } from '../../../middlewares/authentication.middleware.js';
import { validateProviderVenueOwnership } from "../../../middlewares/validateProviderVenueOwnership.middleware.js"
import { getHostBookingsController, getHostBookingByIdController, getHostBookingsStatsController } from './bookings.controller.js';

const router = express.Router();

router.get('/', checkForAuthenticationCookie("token"), getHostBookingsController);
router.get('/booking/:bookingId', checkForAuthenticationCookie("token"), getHostBookingByIdController);
router.get('/stats', checkForAuthenticationCookie("token"), getHostBookingsStatsController);

router.get('/venue/:venueId', checkForAuthenticationCookie("token"), validateProviderVenueOwnership, getHostBookingsController);

export default router;