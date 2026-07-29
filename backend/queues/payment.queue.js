import { Queue } from "bullmq";
import { getRedisClient } from "../redis/client.js";

const PAYMENT_QUEUE_NAME = "payment-processing";

let paymentQueue = null;

/**
 * Returns the singleton payment-processing BullMQ queue.
 */
export function getPaymentQueue() {
  if (!paymentQueue) {
    paymentQueue = new Queue(PAYMENT_QUEUE_NAME, {
      connection: getRedisClient(),
      defaultJobOptions: {
        // Keep completed/failed jobs for 1 hour for observability
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 3600 },
        // Retry up to 5 times with exponential back-off
        attempts: 5,
        backoff: { type: "exponential", delay: 2000 },
      },
    });
    console.log(`[bullmq] queue "${PAYMENT_QUEUE_NAME}" ready`);
  }
  return paymentQueue;
}

/**
 * Enqueue a payment-captured webhook event for async processing.
 * Returns the job id so callers can track it.
 */
export async function enqueuePaymentJob({ orderId, paymentId, event }) {
  const queue = getPaymentQueue();
  const job = await queue.add(
    "process-payment",
    { orderId, paymentId, event },
    {
      // Deduplicate by orderId – BullMQ uses the jobId to skip duplicates
      jobId: `payment:${orderId}`,
    }
  );
  return job.id;
}

export default getPaymentQueue;
