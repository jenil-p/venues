import apiClient from "./client";

export const providerService = {
    makeRequestToBeProvider(data) {
        return apiClient.post("/providers", data);
    },
    getReqStatus() {
        return apiClient.get("/providers/me");
    },
    async getCities() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: "Saputara" },
                    { id: 2, name: "Aabu" },
                    { id: 3, name: "Ahmedabad" },
                    { id: 4, name: "Surat" },
                    { id: 5, name: "Panaji" },
                    { id: 6, name: "Margao" },
                    { id: 7, name: "Chennai" },
                    { id: 8, name: "Coimbatore" },
                    { id: 9, name: "Madurai" },
                    { id: 10, name: "Mumbai" },
                    { id: 11, name: "Pune" },
                    { id: 12, name: "Srinagar" },
                    { id: 13, name: "Dehradun" },
                    { id: 14, name: "Bangalore" },
                    { id: 15, name: "Mysuru" },
                    { id: 16, name: "New Delhi" }
                ]);
            }, 500);
        });
    }
}
