import apiClient from "./client";

export const providerService = {

    // become a provider...
    makeRequestToBeProvider(data) {
        return apiClient.post("/providers-profile", data);
    },
    getProviderRequestStatus() {
        return apiClient.get("/providers-profile/me");
    },
    getProvider(providerId){
        return apiClient.get(`/providers-profile/${providerId}`);
    },

    // venue things...
    listFillVenue(data) {
        return apiClient.post("/providers/venues/", data);
    },
    updateVenue(data, venueId) {
        return apiClient.put(`/providers/venues/${venueId}`, data);
    },
    addVenueType(data, venueId) {
        return apiClient.put(`/providers/venues/${venueId}/type`, data);
    },
    addVenueFeatures(data, venueId) {
        return apiClient.put(`/providers/venues/${venueId}/features`, data);
    },
    addVenuePhotos(data, venueId) {
        return apiClient.post(`/providers/venues/${venueId}/photos`, data);
    },
    addVenuePhotos(data, venueId) {
        return apiClient.put(`/providers/venues/${venueId}/photos/reorder`, data);
    },
    addVenuePricing(data, venueId) {
        return apiClient.put(`/providers/venues/${venueId}/pricing`, data);
    },
    getVenue(venueId) {
        return apiClient.get(`/providers/venues/${venueId}`);
    },
    getAllVenues() {
        return apiClient.get('/providers/venues');
    },
    deleteVenue(venueId) {
        return apiClient.delete(`/providers/venues/${venueId}`);
    },
    deleteVenuePhoto(venueId, photoId) {
        return apiClient.delete(`/providers/venues/${venueId}/photos/${photoId}`);
    }
}
