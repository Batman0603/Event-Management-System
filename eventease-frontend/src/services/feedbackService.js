import api from "./api";

/**
 * Fetches all feedback entries. (Admin)
 * @param {object} params - Query parameters for pagination, etc.
 */
export const getAllFeedback = async (params) => {
  const response = await api.get("/feedback", { params });
  return response.data;
};

/**
 * Fetches all feedback submitted by the current user.
 */
export const getFeedbacksByUser = async () => {
  const response = await api.get("/feedback/user");
  return response.data;
};

/**
 * Submits feedback for a specific event.
 * @param {number} eventId - The ID of the event to give feedback for.
 * @param {object} feedbackData - The feedback data { rating, comment }.
 */
export const submitFeedback = async (eventId, feedbackData) => {
  try {
    const response = await api.post(`/feedback/${eventId}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to submit feedback.");
  }
};

/**
 * Fetches all feedback for events created by the current club admin.
 */
export const getFeedbackForMyEvents = async () => {
  const response = await api.get("/feedback/my-events-feedback");
  return response.data;
};