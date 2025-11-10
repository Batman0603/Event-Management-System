import api from "./api";

/**
 * Fetches all approved events.
 */
export const getAllEvents = async () => {
  const response = await api.get("/events/");
  return response.data;
};

/**
 * Fetches all active and upcoming approved events.
 */
export const getActiveEvents = async () => {
  try {
    const response = await api.get("/events/active");
    // If the response is wrapped in a data property, unwrap it
    const events = response.data?.data || response.data || [];
    // Ensure we always return an array
    return Array.isArray(events) ? events : [events];
  } catch (error) {
    console.error('Error fetching active events:', error);
    throw error;
  }
};

/**
 * Fetches all events pending approval. (Admin)
 */
export const getPendingEvents = async () => {
    const response = await api.get("/events/pending");
    return response.data;
};

/**
 * Approves a pending event. (Admin)
 * @param {number} eventId - The ID of the event to approve.
 */
export const approveEvent = async (eventId) => {
    const response = await api.put(`/events/approve/${eventId}`);
    return response.data;
};

/**
 * Rejects a pending event. (Admin)
 * @param {number} eventId - The ID of the event to reject.
 */
export const rejectEvent = async (eventId) => {
    const response = await api.put(`/events/reject/${eventId}`);
    return response.data;
};

/**
 * Creates a new event. (Admin/Club Admin)
 */
export const createEvent = async (eventData) => {
    const response = await api.post("/events/create", eventData);
    return response.data;
};

/**
 * Registers the current user for an event.
 * @param {number} eventId - The ID of the event to register for.
 */
export const registerForEvent = async (eventId) => {
  const response = await api.post(`/registrations/${eventId}`);
  return response.data;
};

/**
 * Unregisters the current user from an event.
 * @param {number} eventId - The ID of the event to unregister from.
 */
export const unregisterFromEvent = async (eventId) => {
  const response = await api.delete(`/registrations/${eventId}`);
  return response.data;
};

/**
 * Fetches all registrations for the current user.
 */
export const getMyRegistrations = async () => {
  try {
    const response = await api.get("/registrations/my-registrations");
    // If the response is wrapped in a data property, unwrap it
    const registrations = response.data?.data || response.data || [];
    // Ensure we always return an array
    return Array.isArray(registrations) ? registrations : [registrations];
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    throw error;
  }
};