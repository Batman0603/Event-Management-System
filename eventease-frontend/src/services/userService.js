import api from "./api";

export const getAllUsers = (params) => {
  return api.get("/users", { params });
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const updateUser = (userId, userData) => {
  return api.put(`/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};

export const updateMyProfile = async (userId, userData) => {
  // Assuming the backend endpoint for updating a user is /users/{userId}
  const response = await api.put(`/users/${userId}`, userData);
  return response.data; // Return the updated user data
};

export const getMyProfile = () => {
  return api.get("/users/me");  // ✅ Changed from "/profile" to "/users/me"
};