import api from './api';

export const submitFeedback = async (eventId, feedback) => {
  try {
  const response = await api.post(`/feedback/${eventId}`, feedback);
  return response.data;
} catch (error) {
  throw new Error(error.response?.data?.message || 'Failed to submit feedback');
}
};

export const getFeedbacksByUser = async () => {
  try {
    const response = await api.get('/feedback/my-feedbacks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedbacks');
  }
};

export const checkFeedbackExists = async (eventId) => {
  try {
    const response = await api.get(`/feedback/check/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check feedback status');
  }
};