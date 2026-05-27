import axios from "axios";
import { getToken } from "../utils/storage";

// In local dev this falls back to localhost.
// In production (Netlify) set VITE_API_URL in Site Settings → Environment Variables.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,  // 30s — accommodates Render free-tier cold start (~15–25s)
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
