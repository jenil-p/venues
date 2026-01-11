import apiClient from "./client";

export const authService = {
    signup(data) {
        return apiClient.post("/auth/signup", data);
    },

    sendOtp(data) {
        return apiClient.post("/auth/otp", data);
    },

    verifyOtp(data) {
        return apiClient.post("/auth/otp/verify", data);
    },

    getMe() {
        return apiClient.get("/auth/me");
    },

    logout() {
        return apiClient.get("/auth/logout");
    },
    
    deleteUser(userId) {
        return apiClient.delete(`/auth/${userId}`);
    },

    checkIfAdmin() {
        return apiClient.get('/role/isadmin');
    },

    checkIfProvider() {
        return apiClient.get('/role/isprovider');
    },
};
