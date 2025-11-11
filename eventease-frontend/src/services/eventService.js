import api from "./api";

export const getActiveEvents = async () => {
  const response = await api.get("/events/active");
  return response.data.data; // The events array is inside response.data.data
};

export const getAllEvents = async () => {
  const response = await api.get("/events");
  return response.data.data.events;
};

export const registerForEvent = async (eventId) => {
  const response = await api.post(`/registrations/${eventId}`);
  return response.data;
};

export const unregisterFromEvent = async (eventId) => {
  const response = await api.delete(`/registrations/${eventId}`);
  return response.data;
};

export const getMyRegistrations = async () => {
  try {
    const response = await api.get("/registrations/my-registrations");
    // The actual data is in response.data
    return response.data;
  } catch (error) {
    console.error("Error fetching my registrations:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch registrations.");
  }
};

/**
 * Fetches all registrations for a specific event. (Admin)
 * @param {number} eventId - The ID of the event.
 */
export const getRegistrationsForEvent = async (eventId) => {
  try {
    const response = await api.get(`/registrations/event/${eventId}`);
    // The actual data is in response.data.data
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching registrations for event ${eventId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch event registrations.");
  }
};

/**
 * Fetches all registrations with pagination, filtering, and search. (Admin)
 * @param {object} params - Query parameters { page, limit, event_id, search }.
 */
export const getAllRegistrations = async (params) => {
  try {
    const response = await api.get("/registrations/", { params });
    // The actual data is in response.data.data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all registrations:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch all registrations.");
  }
};

/**
 * Creates a new event. (Admin/Club Admin)
 * @param {object} eventData - The data for the new event.
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post("/events/create", eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create event.");
  }
};

/**
 * Updates an existing event. (Admin/Club Admin)
 * @param {number} eventId - The ID of the event to update.
 * @param {object} eventData - The updated event data.
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/update/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update event.");
  }
};

/**
 * Deletes an event. (Admin/Club Admin)
 * @param {number} eventId - The ID of the event to delete.
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/delete/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete event.");
  }
};

/**
 * Fetches a single event by its ID.
 * @param {number} eventId - The ID of the event.
 */
export const getEventById = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

/**
 * Fetches all events created by the current club admin.
 */
export const getEventsByCreator = async () => {
  const response = await api.get("/events/my-events");
  return response.data.data;
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
  try {
    const response = await api.put(`/events/approve/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error approving event ${eventId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to approve event.");
  }
};

/**
 * Rejects a pending event. (Admin)
 * @param {number} eventId - The ID of the event to reject.
 * @param {string} reason - The reason for rejection.
 */
export const rejectEvent = async (eventId, reason) => {
  try {
    const response = await api.put(`/events/reject/${eventId}`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error rejecting event ${eventId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to reject event.");
  }
};

/**
 * Fetches all registrations for events created by the current club admin.
 */
export const getRegistrationsForMyEvents = async () => {
  try {
    const response = await api.get("/registrations/my-events-registrations");
    // The backend wraps the data in an extra "data" object
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching registrations for my events:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch registrations.");
  }
};