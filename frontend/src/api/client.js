import axios from "axios";


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});


apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
      return Promise.reject(error.response?.data || error);
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
