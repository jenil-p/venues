import apiClient from "./client";

export const bookingService = {
    getAvailability(venueId, year, month) {
        return apiClient.get(`/venues/${venueId}/availability`, {
            params: { year, month },
        });
    },

    createBooking(venueId, { noOfGuest, startTime, endTime }) {
        return apiClient.post(`/book/venues/${venueId}`, {
            noOfGuest,
            startTime: new Date(startTime).toISOString(),
            endTime:   new Date(endTime).toISOString(),
        });
    },

    proceedToPayment(bookingId) {
        return apiClient.post(`/book/proceed/${bookingId}`);
    },

    cancelBooking(bookingId) {
        return apiClient.delete(`/book/booking/${bookingId}`);
    },

    revertToCart(bookingId) {
        return apiClient.patch(`/book/booking/${bookingId}`);
    },

    getBooking(bookingId){
        return apiClient.get(`/book/booking/${bookingId}`);
    },

    getUserBookings(){
        return apiClient.get(`/book/my-bookings`);
    },

    createPaymentOrder(bookingId) {
        return apiClient.post('/payment/create-order', { bookingId });
    },

    verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        return apiClient.post('/payment/verify-payment', {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });
    }
};
