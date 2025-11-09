// frontend/src/services/authService.js
import axios from "axios";
import { API_BASE_URL } from "../config.js";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with every request
});

// login: backend sets HttpOnly cookie; returns 200/400 with message
export async function loginApi({ email, password }) {
  try {
    const resp = await api.post("/auth/login", { email, password });
    // The backend now sets the HttpOnly cookie.
    // No need to store the token in localStorage.
    return resp.data;
  } catch (err) {
    // normalize error
    if (err.response && err.response.data) throw err.response.data;
    throw { message: "Network error during login" };
  }
}

export async function signupApi({ name, email, password, role = "student", department }) {
  try {
    const resp = await api.post("/auth/signup", { name, email, password, role, department });
    // The backend now sets the HttpOnly cookie.
    // No need to store the token in localStorage.
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) throw err.response.data;
    throw { message: "Network error during signup" };
  }
}

export async function logoutApi() {
  try {
    const resp = await api.post("/auth/logout");
    // The backend is responsible for clearing the cookie.
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) throw err.response.data;
    throw { message: "Network error during logout" };
  }
}

// This endpoint verifies the HttpOnly cookie server-side and returns user info
export async function verifyTokenApi() {
  try {
    const resp = await api.get("/auth/verify-token"); // The browser will send the cookie
    return resp.data; // should include user info (id, email, role, name)
  } catch (err) {
    if (err.response && err.response.status === 401) {
      throw { message: "Unauthenticated", status: 401 };
    }
    if (err.response && err.response.data) throw err.response.data;
    throw { message: "Network error during token verification" };
  }
}