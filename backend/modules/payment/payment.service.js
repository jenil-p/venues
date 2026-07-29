import prisma from '../../prisma/client.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { enqueuePaymentJob } from '../../queues/payment.queue.js';
import { enqueueNotification } from '../../queues/notification.queue.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PENDING_PAYMENT_TTL_MS = process.env.PENDING_PAYMENT_EXPIRY_MINUTES * 60 * 1000;

export async function createPaymentOrder({ bookingId, userId }) {
    return prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
            where: { id: bookingId },
            include: { 
                venue: true,
                payment: true 
            },
        });

        if (!booking || booking.userId !== userId) {
            const err = new Error("Booking not found");
            err.status = 404;
            throw err;
        }

        if (booking.bookingStatus === 'PENDING_PAYMENT') {

            // if already there is a payment record, that is within the boundary then return that (instead of creating new one)
            if (booking.expiresAt && booking.expiresAt > new Date()) {
                // console.log(`user returning - reusing existing payment window for booking ${bookingId}`);

                if (booking.payment && booking.payment.status === 'PENDING') {
                    return {
                        orderId: booking.payment.transactionId,
                        amount: Number(booking.payment.amount) * 100,
                        currency: 'INR',
                        key: process.env.RAZORPAY_KEY_ID,
                        booking: booking,
                    };
                }
            }
            else {
                const err = new Error("Payment window expired, please re-add to cart");
                err.status = 409;
                throw err;
            }
        }

        if (!['CART', 'PENDING_PAYMENT'].includes(booking.bookingStatus)) {
            const err = new Error("This booking cannot proceed to payment");
            err.status = 400;
            throw err;
        }

        // Re-validate availability
        const { isSlotAvailable } = await import('../booking/availability/availability.service.js');
        const available = await isSlotAvailable(tx, booking.venueId, booking.startTime, booking.endTime, userId);

        if (!available) {
            const err = new Error("This slot is no longer available");
            err.status = 409;
            throw err;
        }

        const amountInPaise = Math.round(Number(booking.totalCost) * 100);

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `book_${bookingId}`,
            notes: {
                bookingId: booking.id.toString(),
                userId: userId.toString(),
            },
        });

        // Create or update Payment record
        if (!booking.payment) {
            await tx.payment.create({
                data: {
                    bookingId: booking.id,
                    transactionId: order.id,
                    amount: booking.totalCost,
                    paymentMethod: 'CREDIT_CARD',
                    status: 'PENDING',
                },
            });
        }

        // Update booking status
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
                bookingStatus: 'PENDING_PAYMENT',
                expiresAt: new Date(Date.now() + PENDING_PAYMENT_TTL_MS),
            },
            include: {
                venue: { select: { venuename: true } },
                payment: true,
            },
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            booking: updatedBooking,
        };
    });
}

export async function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        const err = new Error("Invalid payment signature");
        err.status = 400;
        throw err;
    }

    const payment = await prisma.payment.findUnique({
        where: { transactionId: razorpay_order_id },
        include: { booking: true },
    });

    if (!payment) {
        const err = new Error("Payment record not found");
        err.status = 404;
        throw err;
    }

    // Idempotency check: if webhook worker already processed this, skip
    if (payment.status === 'SUCCESS') {
        return { success: true, bookingId: payment.bookingId };
    }

    await prisma.$transaction([
        prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'SUCCESS' },
        }),
        prisma.booking.update({
            where: { id: payment.bookingId },
            data: {
                bookingStatus: 'CONFIRMED',
                expiresAt: null,
            },
        }),
    ]);

    // Best-effort notifications — must not break the success response
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: payment.bookingId },
            include: {
                venue: { select: { venuename: true, providerId: true } },
                user: { select: { fullname: true, email: true } },
            },
        });

        if (booking?.user?.email) {
            await enqueueNotification({
                type: "booking_confirmed_user",
                data: {
                    email: booking.user.email,
                    userName: booking.user.fullname,
                    venueName: booking.venue.venuename,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalCost: payment.amount,
                    bookingId: payment.bookingId,
                },
            });
        }

        if (booking?.venue?.providerId) {
            const hostProfile = await prisma.providerProfile.findUnique({
                where: { id: booking.venue.providerId },
                include: { user: { select: { fullname: true, email: true } } },
            });
            if (hostProfile?.user?.email) {
                await enqueueNotification({
                    type: "booking_confirmed_host",
                    data: {
                        email: hostProfile.user.email,
                        hostName: hostProfile.user.fullname,
                        userName: booking.user.fullname,
                        venueName: booking.venue.venuename,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                        totalCost: payment.amount,
                        bookingId: payment.bookingId,
                    },
                });
            }
        }
    } catch (notifErr) {
        console.warn("[payment] failed to enqueue confirmation notifications:", notifErr.message);
    }

    return { success: true, bookingId: payment.bookingId };
}

/**
 * Webhook handler — verifies the Razorpay signature, enqueues a
 * payment-processing job, and returns 200 immediately so Razorpay
 * doesn't retry. The actual payment processing happens asynchronously
 * in the BullMQ worker.
 */
export async function handleRazorpayWebhook(payload, signature) {
    const isValid = Razorpay.validateWebhookSignature(
        JSON.stringify(payload),
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
        const err = new Error("Invalid webhook signature");
        err.status = 400;
        throw err;
    }

    const event = payload.event;
    const paymentEntity = payload.payload.payment?.entity;

    if (!paymentEntity) {
        console.warn("[webhook] received event without payment entity:", event);
        return;
    }

    // Enqueue the job for async processing
    const jobId = await enqueuePaymentJob({
        orderId: paymentEntity.order_id,
        paymentId: paymentEntity.id,
        event,
    });

    console.log(`[webhook] enqueued payment job ${jobId} for order ${paymentEntity.order_id} (${event})`);
}