import apiClient from "./client";

export const venueService = {
    getVenues(){
        return apiClient.get("/venues");
    },
    getVenue(venueId){
        return apiClient.get(`/venues/${venueId}`);
    },

    toggleWishlist(venueId){
        return apiClient.post(`/wishlist/venues/${venueId}/toggle`);
    },

    getWishlist(){
        return apiClient.get('/wishlist/my-wishlist');
    }
}