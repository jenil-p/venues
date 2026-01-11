import apiClient from "./client";

export const venueService = {
    getVenues(){
        return apiClient.get("/venues");
    },
    getVenue(venueId){
        return apiClient.get(`/venues/${venueId}`);
    }
}