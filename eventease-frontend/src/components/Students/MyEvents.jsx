import React, { useState, useEffect, useCallback } from "react";
import { 
  getMyRegistrations, 
  unregisterFromEvent 
} from "../../services/eventService";
import { 
  submitFeedback, 
  checkFeedbackExists 
} from "../../services/feedbackService";
import StudentEventCard from "../../components/Students/StudentEventCard.jsx";
import { 
  Box, Typography, Button, Alert, CircularProgress, 
  Snackbar, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from "@mui/material";
import FeedbackForm from "../../components/FeedbackForm";

export default function MyEvents() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, eventId: null, eventTitle: "" });
  const [feedbackForm, setFeedbackForm] = useState({ open: false, eventId: null, eventTitle: "", isSubmitting: false });
  const [eventFeedbacks, setEventFeedbacks] = useState({});

  const fetchRegisteredEvents = useCallback(async () => {
    try {
      setLoading(true);
      const registrationsData = await getMyRegistrations();
      let events = [];

      if (Array.isArray(registrationsData)) {
        events = registrationsData;
      } else if (registrationsData?.data && Array.isArray(registrationsData.data)) {
        events = registrationsData.data;
      } else if (registrationsData?.data) {
        events = [registrationsData.data];
      }
      
      setRegisteredEvents(events);
    } catch (err) {
      console.error('Error fetching registered events:', err);
      setError(err.message || "Failed to fetch registered events.");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkEventFeedbacks = useCallback(async (events) => {
    const feedbacks = {};
    for (const event of events) {
      try {
        const status = await checkFeedbackExists(event.event_id);
        feedbacks[event.event_id] = status.exists;
      } catch (err) {
        console.error(`Error checking feedback for event ${event.event_id}:`, err);
        feedbacks[event.event_id] = false;
      }
    }
    setEventFeedbacks(feedbacks);
  }, []);

  useEffect(() => {
    fetchRegisteredEvents();
  }, [fetchRegisteredEvents]);

  useEffect(() => {
    if (registeredEvents.length > 0) {
      checkEventFeedbacks(registeredEvents);
    }
  }, [registeredEvents, checkEventFeedbacks]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleUnregister = async (eventId) => {
    try {
      await unregisterFromEvent(eventId);
      setRegisteredEvents(prev => prev.filter(event => event.event_id !== eventId));
      setNotification({
        open: true,
        message: "Successfully unregistered from the event",
        severity: "success"
      });
      setConfirmDialog({ open: false, eventId: null, eventTitle: "" });
    } catch (err) {
      console.error('Error unregistering:', err);
      setNotification({
        open: true,
        message: err.message || "Failed to unregister from the event",
        severity: "error"
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Registered Events
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {registeredEvents.length === 0 && !error ? (
          <Typography>You have not registered for any events yet.</Typography>
        ) : (
          registeredEvents.map((event) => (
            <StudentEventCard
              key={event.event_id}
              event={{
                id: event.event_id,
                title: event.event_title,
                description: event.description,
                date: event.date,
                location: event.location,
              }}
              showRegisterButton={false}
            >
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {new Date(event.date) < new Date() && !eventFeedbacks[event.event_id] && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    onClick={() => setFeedbackForm({
                      open: true, 
                      eventId: event.event_id, 
                      eventTitle: event.event_title, 
                      isSubmitting: false
                    })}
                  >
                    Provide Feedback
                  </Button>
                )}
                {eventFeedbacks[event.event_id] && (
                  <Button variant="outlined" size="small" disabled>
                    Feedback Submitted
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => setConfirmDialog({
                    open: true,
                    eventId: event.event_id,
                    eventTitle: event.event_title
                  })}
                >
                  Unregister
                </Button>
              </Box>
            </StudentEventCard>
          ))
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, eventId: null, eventTitle: "" })}
      >
        <DialogTitle>Confirm Unregistration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unregister from "{confirmDialog.eventTitle}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, eventId: null, eventTitle: "" })}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleUnregister(confirmDialog.eventId)} 
            color="error" 
            variant="contained"
          >
            Unregister
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Feedback Form */}
      <FeedbackForm
        open={feedbackForm.open}
        onClose={() => setFeedbackForm(prev => ({ ...prev, open: false }))}
        eventTitle={feedbackForm.eventTitle}
        isSubmitting={feedbackForm.isSubmitting}
        onSubmit={async (feedbackData) => {
          setFeedbackForm(prev => ({ ...prev, isSubmitting: true }));
          try {
            await submitFeedback(feedbackForm.eventId, feedbackData);
            setNotification({
              open: true,
              message: "Thank you for your feedback!",
              severity: "success"
            });
            setEventFeedbacks(prev => ({
              ...prev,
              [feedbackForm.eventId]: true
            }));
            setFeedbackForm({ open: false, eventId: null, eventTitle: "", isSubmitting: false });
          } catch (err) {
            setNotification({
              open: true,
              message: err.message || "Failed to submit feedback",
              severity: "error"
            });
            setFeedbackForm(prev => ({ ...prev, isSubmitting: false }));
          }
        }}
      />
    </Box>
  );
}
