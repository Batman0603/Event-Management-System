import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getActiveEvents, registerForEvent, unregisterFromEvent, getMyRegistrations,
} from "../../services/eventService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import StudentEventCard from "../../components/Students/StudentEventCard.jsx"; // Import the new StudentEventCard component

export default function StudentDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsData, registrationsData] = await Promise.all([
        getActiveEvents(),
        getMyRegistrations(),
      ]);
      
      console.log("Raw events response:", eventsData);
      console.log("Raw registrations response:", registrationsData);
      
      // Handle events data
      const eventsArray = eventsData || []; // eventsData will now directly be the array of events
      
      console.log("Processed events array:", eventsArray);
      setEvents(eventsArray);
      
      // Handle registrations data
      let registrationsArray = [];
      if (Array.isArray(registrationsData)) {
        registrationsArray = registrationsData;
      } else if (registrationsData?.data && Array.isArray(registrationsData.data)) {
        registrationsArray = registrationsData.data;
      }
      
      console.log("Processed registrations array:", registrationsArray);
      const registeredIds = new Set(registrationsArray.map(reg => reg.event?.id).filter(Boolean));
      console.log("Registered event IDs:", Array.from(registeredIds));
      setRegisteredEventIds(registeredIds);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      setRegisteredEventIds(prev => new Set(prev).add(eventId));
      // Real-time update of seat count on registration
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, seats_booked: (event.seats_booked || 0) + 1 }
          : event
      ));
      setNotification({ 
        open: true, 
        message: "Successfully registered!", 
        severity: "success" 
      });
    } catch (err) {
      setNotification({ 
        open: true, 
        message: err.message || "Registration failed.", 
        severity: "error" 
      });
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await unregisterFromEvent(eventId);
      setRegisteredEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      // Real-time update of seat count on un-registration
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === eventId && event.seats_booked > 0
          ? { ...event, seats_booked: event.seats_booked - 1 }
          : event
      ));
      setNotification({ 
        open: true, 
        message: "Successfully unregistered.", 
        severity: "info" 
      });
    } catch (err) {
      setNotification({ 
        open: true, 
        message: err.message || "Unregistering failed.", 
        severity: "error" 
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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

      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || "Student"}!
      </Typography>
      
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Available Events
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!Array.isArray(events) ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading events. Please try again later.
        </Alert>
      ) : events.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          No events available at the moment.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        > 
          {events.map((event) => (
            <StudentEventCard
              key={event.id}
              event={event}
              isRegistered={registeredEventIds.has(event.id)}
              onRegister={handleRegister} // Pass the register handler
              onUnregister={handleUnregister} // Pass the unregister handler
            />
          ))}
        </Box>
      )}
    </Box>
  );
}