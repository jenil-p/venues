import { Worker } from "bullmq";
import { getRedisClient } from "../redis/client.js";
import { sendEmail } from "../emails/resend.client.js";
import {
  bookingConfirmationUserEmail,
  bookingConfirmationHostEmail,
  bookingCancellationUserEmail,
} from "../emails/templates.js";

const NOTIFICATION_QUEUE_NAME = "notifications";

/**
 * Start the notification worker.
 * Listens for email notification jobs and sends them via Resend.
 */
export function startNotificationWorker() {
  const worker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job) => {
      const { type, data } = job.data;
      console.log(`[notification-worker] sending "${type}" to ${data.email}`);

      let emailPayload;

      switch (type) {
        case "booking_confirmed_user":
          emailPayload = bookingConfirmationUserEmail(data);
          break;

        case "booking_confirmed_host":
          emailPayload = bookingConfirmationHostEmail(data);
          break;

        case "booking_cancelled_user":
          emailPayload = bookingCancellationUserEmail(data);
          break;

        default:
          console.warn(`[notification-worker] unknown notification type: ${type}`);
          return;
      }

      await sendEmail({
        // to: data.email, // prod
        to: "jenilsakriya612@gmail.com", // test env...
        subject: emailPayload.subject,
        html: emailPayload.html,
      });
    },
    {
      connection: getRedisClient(),
      concurrency: 3,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[notification-worker] job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[notification-worker] job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    if (err.message && !err.message.includes("ECONNREFUSED")) {
      console.error("[notification-worker] unexpected error:", err.message);
    }
  });

  console.log("[notification-worker] started — waiting for jobs...");
  return worker;
}
