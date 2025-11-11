import api from "./api";

/**
 * Fetches the system logs as plain text.
 */
export const getSystemLogs = async () => {
  // The backend route is /api/logs, and the api instance is likely prefixed with /api
  const response = await api.get("/logs", {
    transformResponse: (res) => res, // Tell axios to return the raw text response
  });
  return response.data;
};