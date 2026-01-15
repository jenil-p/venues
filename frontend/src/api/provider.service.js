import apiClient from "./client";

export const providerService = {
    makeRequestToBeProvider(data) {
        return apiClient.post("/providers", data);
    },
    getProviderRequestStatus() {
        return apiClient.get("/providers/me");
    },
    getCities() {
        return apiClient.get("/address/city");
    }
}
