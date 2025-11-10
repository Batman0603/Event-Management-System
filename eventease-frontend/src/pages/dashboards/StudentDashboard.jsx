import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getActiveEvents,
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
} from "../../services/eventService";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

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
      let eventsArray = [];
      if (Array.isArray(eventsData)) {
        eventsArray = eventsData;
      } else if (eventsData?.data && Array.isArray(eventsData.data)) {
        eventsArray = eventsData.data;
      } else if (typeof eventsData === 'object') {
        eventsArray = [eventsData];
      }
      
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
      const registeredIds = new Set(registrationsArray.map(reg => 
        reg.event_id || reg.eventId || reg.id
      ));
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

  // Render function to handle event card display
  const renderEventCard = (event) => {
    if (!event || !event.id) {
      console.warn("Invalid event data:", event);
      return null;
    }

    return (
      <Card
        key={event.id}
        elevation={3}
        sx={{
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {event.title || "Untitled Event"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {event.description || "No description available"}
          </Typography>
        </CardContent>
        <CardActions 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: 2, 
            pb: 2, 
            pt: 0 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {event.location || "Location TBD"}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}
              </Typography>
            </Box>
          </Box>
          <div>
            {registeredEventIds.has(event.id) ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 1, cursor: 'default' }}
                >
                  Registered
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="small" 
                  onClick={() => handleUnregister(event.id)}
                >
                  Unregister
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => handleRegister(event.id)}
              >
                Register
              </Button>
            )}
          </div>
        </CardActions>
      </Card>
    );
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
          {events.map((event) => renderEventCard(event))}
        </Box>
      )}
    </Box>
  );
}