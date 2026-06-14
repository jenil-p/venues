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
};
