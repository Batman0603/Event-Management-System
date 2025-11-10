import api from "./api";

/**
 * Fetches the profile of the currently authenticated user.
 */
export const getMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {string} userId - The ID of the user to update.
 * @param {object} profileData - The data to update.
 */
export const updateMyProfile = async (userId, profileData) => {
  const response = await api.put(`/users/${userId}`, profileData);
  return response.data;
};