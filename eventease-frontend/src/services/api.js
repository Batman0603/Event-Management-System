// src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with every request
});

// Optional: Add interceptors for logging or error handling
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request:", request.method, request.url);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;