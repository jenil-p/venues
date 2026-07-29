/**
 * Background worker entry point.
 *
 * Usage:
 *   node workers/index.js
 *
 * Starts both the payment-processing worker and the notification
 * worker. They will run indefinitely, processing jobs from their
 * respective BullMQ queues.
 */
import { startPaymentWorker } from "./payment.worker.js";
import { startNotificationWorker } from "./notification.worker.js";

console.log("═══════════════════════════════════════════");
console.log("  VenueFinder Background Workers");
console.log("═══════════════════════════════════════════");

let paymentWorker;
let notificationWorker;

try {
  paymentWorker = startPaymentWorker();
} catch (err) {
  console.error("Failed to start payment worker:", err.message);
}

try {
  notificationWorker = startNotificationWorker();
} catch (err) {
  console.error("Failed to start notification worker:", err.message);
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n[workers] shutting down...");
  if (paymentWorker) await paymentWorker.close();
  if (notificationWorker) await notificationWorker.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n[workers] shutting down...");
  if (paymentWorker) await paymentWorker.close();
  if (notificationWorker) await notificationWorker.close();
  process.exit(0);
});
