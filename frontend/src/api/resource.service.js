import apiClient from "./client";

export const resourceService = {
    getVenueTypes(){
        return apiClient.get("/resources/venue-types");
    },
    getVenueFeatures(){
        return apiClient.get("/resources/venue-features");
    },
    getLocations(){
        return apiClient.get("/resources/locations");
    },
    getCities(){
        return apiClient.get("/resources/cities");
    },
    getFullFormOptions(){
        return apiClient.get("/resources/form-options");
    },
    getVenueTypes(){
        return apiClient.get("/resources/service-categories");
    },
}