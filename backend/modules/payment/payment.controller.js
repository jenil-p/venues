import { createPaymentOrder, verifyPaymentSignature, handleRazorpayWebhook } from './payment.service.js';

export async function createOrderController(req, res) {
    try {
        const { bookingId } = req.body;
        const userId = req.user.id;

        const result = await createPaymentOrder({ bookingId, userId });
        return res.status(200).json(result);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error("Create Order Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyPaymentController(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const result = await verifyPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return res.status(200).json({
            message: "Payment verified successfully",
            ...result,
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error("Verify Payment Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function webhookController(req, res) {
    try {
        const signature = req.headers['x-razorpay-signature'];
        await handleRazorpayWebhook(req.body, signature);
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(400).json({ status: 'error' });
    }
}