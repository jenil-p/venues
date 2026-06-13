import express from 'express';
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { makeBookingSchema } from './booking.validator.js';
import { makeBooking } from './booking.controller.js';

const router = express.Router();

router.post('/venues/:venueId', checkForAuthenticationCookie("token"), validate(makeBookingSchema), makeBooking);

export default router;