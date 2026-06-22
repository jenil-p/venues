import express from 'express';
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { makeBookingSchema, bookingIdValidator } from './booking.validator.js';
import { makeBooking, proceedToPaymentController, cancelBookingController, getBookingByIdController } from './booking.controller.js';

const router = express.Router();

router.post('/venues/:venueId', checkForAuthenticationCookie("token"), validate(makeBookingSchema), makeBooking);

router.get('/booking/:bookingId', checkForAuthenticationCookie("token"), getBookingByIdController);

router.post('/proceed/:bookingId', checkForAuthenticationCookie("token"), validate(bookingIdValidator), proceedToPaymentController);

router.delete('/booking/:bookingId', checkForAuthenticationCookie("token"), validate(bookingIdValidator), cancelBookingController);

export default router;