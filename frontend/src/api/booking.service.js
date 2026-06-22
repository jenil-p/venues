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

    getBooking(bookingId){
        return apiClient.get(`/book/booking/${bookingId}`);
    }
};
