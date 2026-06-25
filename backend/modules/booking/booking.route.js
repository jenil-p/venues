import express from 'express';
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { makeBookingSchema, bookingIdValidator } from './booking.validator.js';
import { makeBooking, cancelBookingController, getBookingByIdController, getUserBookingsController, revertToCartController } from './booking.controller.js';

const router = express.Router();

router.post('/venues/:venueId', checkForAuthenticationCookie("token"), validate(makeBookingSchema), makeBooking);

router.get('/booking/:bookingId', checkForAuthenticationCookie("token"), getBookingByIdController);

router.delete('/booking/:bookingId', checkForAuthenticationCookie("token"), validate(bookingIdValidator), cancelBookingController);

router.patch('/booking/:bookingId', checkForAuthenticationCookie("token"), validate(bookingIdValidator), revertToCartController);

router.get('/my-bookings', checkForAuthenticationCookie("token"), getUserBookingsController);

export default router;