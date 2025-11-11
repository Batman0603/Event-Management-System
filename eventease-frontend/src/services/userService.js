import api from "./api";

/**
 * Fetches the profile of the currently authenticated user.
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get("/users/me");
    // The actual user profile is nested in the 'data' property of the response
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch profile.");
  }
};

/**
 * Fetches all users with pagination and filtering. (Admin)
 * @param {object} params - Query parameters { page, limit, search, role }.
 */
export const getAllUsers = async (params) => {
  const response = await api.get("/users", { params });
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {object} profileData - The updated profile data { name, department }.
 */
export const updateMyProfile = async (profileData) => {
  try {
    const response = await api.put("/users/me", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update profile.");
  }
};

/**
 * Updates a user's details. (Admin)
 * @param {number} userId - The ID of the user to update.
 * @param {object} userData - The updated user data.
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user.");
  }
};

/**
 * Deletes a user. (Admin)
 * @param {number} userId - The ID of the user to delete.
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user.");
  }
};

/**
 * Creates a new user. (Admin)
 * @param {object} userData - The data for the new user.
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users/", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create user.");
  }
};