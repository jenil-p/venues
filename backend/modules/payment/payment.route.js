import express from 'express';
import { checkForAuthenticationCookie } from '../../middlewares/authentication.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createOrderSchema, verifyPaymentSchema, bookingIdValidator } from './payment.validator.js';
import { createOrderController, verifyPaymentController, webhookController } from './payment.controller.js';

const router = express.Router();

router.post('/create-order',  checkForAuthenticationCookie("token"), createOrderController );

router.post('/verify-payment',  checkForAuthenticationCookie("token"), verifyPaymentController );

router.post('/webhook', webhookController);

export default router;