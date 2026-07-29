import { Queue } from "bullmq";
import { getRedisClient } from "../redis/client.js";

const NOTIFICATION_QUEUE_NAME = "notifications";

let notificationQueue = null;

/**
 * Returns the singleton notification BullMQ queue.
 */
export function getNotificationQueue() {
  if (!notificationQueue) {
    notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
      connection: getRedisClient(),
      defaultJobOptions: {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
      },
    });
    console.log(`[bullmq] queue "${NOTIFICATION_QUEUE_NAME}" ready`);
  }
  return notificationQueue;
}

/**
 * Enqueue a notification job.
 * @param {"booking_confirmed_user" | "booking_confirmed_host" | "booking_cancelled_user"} type
 * @param {object} data  – payload with recipient, booking details, etc.
 */
export async function enqueueNotification({ type, data }) {
  const queue = getNotificationQueue();
  const job = await queue.add(type, { type, data });
  return job.id;
}

export default getNotificationQueue;
