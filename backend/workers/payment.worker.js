import { Worker } from "bullmq";
import { getRedisClient } from "../redis/client.js";
import prisma from "../prisma/client.js";
import { enqueueNotification } from "../queues/notification.queue.js";

const PAYMENT_QUEUE_NAME = "payment-processing";

/**
 * Start the payment-processing worker.
 * Listens for "process-payment" jobs, updates the booking and payment
 * records idempotently, and enqueues a notification job on success.
 */
export function startPaymentWorker() {
  const worker = new Worker(
    PAYMENT_QUEUE_NAME,
    async (job) => {
      const { orderId, paymentId, event } = job.data;
      console.log(`[payment-worker] processing job ${job.id} — order: ${orderId}`);

      if (event === "payment.captured") {
        await handleSuccessfulPayment(orderId, paymentId);
      } else if (event === "payment.failed") {
        await handleFailedPayment(orderId, paymentId);
      }
    },
    {
      connection: getRedisClient(),
      concurrency: 5, // process up to 5 payments in parallel
    }
  );

  worker.on("completed", (job) => {
    console.log(`[payment-worker] job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[payment-worker] job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    // BullMQ also emits 'error' on connection issues — don't crash the process
    if (err.message && !err.message.includes("ECONNREFUSED")) {
      console.error("[payment-worker] unexpected error:", err.message);
    }
  });

  console.log("[payment-worker] started — waiting for jobs...");
  return worker;
}

/**
 * Idempotent payment capture handler.
 * Uses a transaction so concurrent duplicate webhooks are safe.
 */
async function handleSuccessfulPayment(orderId, paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: orderId },
    include: {
      booking: {
        include: {
          venue: {
            select: { venuename: true, providerId: true },
          },
          user: {
            select: { fullname: true, email: true },
          },
        },
      },
    },
  });

  if (!payment) {
    console.warn(`[payment-worker] no payment record found for order ${orderId} — skipping`);
    return;
  }

  // Idempotency check: if already SUCCESS, skip
  if (payment.status === "SUCCESS") {
    console.log(`[payment-worker] payment ${orderId} already processed — skipping`);
    return;
  }

  // Update inside a transaction
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        transactionId: paymentId, // Razorpay payment id (different from order id)
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        bookingStatus: "CONFIRMED",
        expiresAt: null,
      },
    }),
  ]);

  console.log(`[payment-worker] booking ${payment.bookingId} confirmed`);

  // Best-effort notifications — a transient Redis failure shouldn't cause
  // a job retry (which would skip due to idempotency), so we catch & log.
  try {
    const booking = payment.booking;

    if (booking.user?.email) {
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
  } catch (notifErr) {
    console.warn("[payment-worker] failed to enqueue notification:", notifErr.message);
  }
}

/**
 * Handle a failed payment event from Razorpay.
 */
async function handleFailedPayment(orderId, paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: orderId },
  });

  if (!payment) {
    console.warn(`[payment-worker] no payment record found for failed order ${orderId}`);
    return;
  }

  // Idempotency check
  if (payment.status === "FAILED") {
    console.log(`[payment-worker] payment ${orderId} already marked failed — skipping`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "FAILED",
      transactionId: paymentId,
    },
  });

  console.log(`[payment-worker] payment ${orderId} marked as FAILED`);
}
