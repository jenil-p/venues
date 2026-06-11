import express from 'express'

import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { makeBooking } from './booking.controller.js'

const router = express.Router();

router.post('/venues/:venueId/users/:userId' , checkForAuthenticationCookie("token") , makeBooking);

export default router;