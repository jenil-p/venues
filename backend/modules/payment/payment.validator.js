import { z } from 'zod';

export const createOrderSchema = z.object({
    bookingId: z.number().int().positive(),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export const bookingIdValidator = z.object({
    bookingId: z.string().regex(/^\d+$/).transform(Number),
});