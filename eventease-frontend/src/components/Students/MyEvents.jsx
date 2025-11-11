import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { getMyRegistrations, unregisterFromEvent } from "../../services/eventService";
import { submitFeedback } from "../../services/feedbackService";
import StudentEventCard from "./StudentEventCard";
import FeedbackForm from "../FeedbackForm";

export default function MyEvents() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const registrations = await getMyRegistrations();
      setRegisteredEvents(registrations || []);
    } catch (err) {
      setError(err.message || "Failed to fetch your registered events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleUnregister = async (eventId) => {
    if (window.confirm("Are you sure you want to unregister from this event?")) {
      try {
        await unregisterFromEvent(eventId);
        setNotification({ open: true, message: "Successfully unregistered.", severity: "info" });
        fetchMyEvents(); // Refresh the list
      } catch (err) {
        setNotification({ open: true, message: err.message || "Unregistering failed.", severity: "error" });
      }
    }
  };

  const handleOpenFeedbackModal = (event) => {
    setSelectedEventForFeedback(event);
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedEventForFeedback(null);
  };

  const handleFeedbackSubmit = async ({ rating, comment }) => {
    if (!selectedEventForFeedback) return;
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback(selectedEventForFeedback.event.id, { rating, comment });
      setNotification({ open: true, message: "Feedback submitted successfully!", severity: "success" });
      handleCloseFeedbackModal();
    } catch (err) {
      setNotification({ open: true, message: err.message || "Failed to submit feedback.", severity: "error" });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>My Registered Events</Typography>
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {registeredEvents.length === 0 ? (
        <Typography>You have not registered for any events yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {registeredEvents
            .filter((registration) => registration.event) // Filter out registrations without an event
            .map((registration) => (
              <StudentEventCard
                key={registration.id}
                event={registration.event}
                isRegistered={true} // Always true on this page
                onUnregister={() => handleUnregister(registration.event.id)}
                onGiveFeedback={() => handleOpenFeedbackModal(registration)}
                showGiveFeedback={new Date(registration.event.date) < new Date()} // Only show for past events
              />
            ))}
        </Box>
      )}

      {selectedEventForFeedback && (
        <FeedbackForm
          open={feedbackModalOpen}
          onClose={handleCloseFeedbackModal} 
          eventTitle={selectedEventForFeedback.event.title}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmittingFeedback}
        />
      )}
    </Box>
  );
}