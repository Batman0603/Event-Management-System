import React, { useState, useEffect, useCallback } from "react";
import { getPendingEvents, approveEvent, rejectEvent } from "../../services/eventService";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const PendingEventsView = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchPendingEvents = useCallback(async () => {
    try {
      const eventData = await getPendingEvents();
      setPendingEvents(eventData.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch pending events.");
    }
  }, []);

  useEffect(() => {
    fetchPendingEvents();
  }, [fetchPendingEvents]);

  const handleApprove = async (eventId) => {
    try {
      await approveEvent(eventId);
      fetchPendingEvents();
    } catch (err) {
      setError(err.message || "Failed to approve event.");
    }
  };

  const handleReject = async (eventId) => {
    try {
      await rejectEvent(eventId);
      fetchPendingEvents();
    } catch (err) {
      setError(err.message || "Failed to reject event.");
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Approve Events
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {pendingEvents.length === 0 && !error && <Typography>No events are currently pending approval.</Typography>}
        {pendingEvents.map((event) => (
          <Card key={event.id} elevation={3} sx={{ borderRadius: "12px" }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {event.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                {event.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2, pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">{event.location}</Typography>
              </Box>
              <div>
                <Button variant="contained" color="success" size="small" onClick={() => handleApprove(event.id)} sx={{ mr: 1 }}>Approve</Button>
                <Button variant="contained" color="error" size="small" onClick={() => handleReject(event.id)}>Reject</Button>
              </div>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default PendingEventsView;