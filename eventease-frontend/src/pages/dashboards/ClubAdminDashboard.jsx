import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEventsByCreator, createEvent, deleteEvent } from "../../services/eventService";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getEventsByCreator();
      setMyEvents(eventData.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch your events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreateEvent = async () => {
    try {
      await createEvent(formData);
      handleCloseModal();
      fetchMyEvents(); // Refresh the list to show the new pending event
      alert("Event created successfully and is pending approval.");
    } catch (err) {
      setError(err.message || "Failed to create event.");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      fetchMyEvents(); // Refresh the list
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    }
  };

  const getStatusChip = (status) => {
    const color = {
      pending: "warning",
      approved: "success",
      rejected: "error",
    }[status];
    return <Chip label={status} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Manage My Events</Typography>
        <Button variant="contained" onClick={handleOpenModal}>Create New Event</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {loading ? <Typography>Loading your events...</Typography> : myEvents.length === 0 && !error ? (
          <Typography>You have not created any events yet.</Typography>
        ) : (
          myEvents.map((event) => (
          <Card key={event.id} elevation={3} sx={{ borderRadius: "12px" }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                {getStatusChip(event.status)}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {event.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2, pt: 0 }}>
              <Typography variant="caption" color="text.secondary">
                Date: {new Date(event.date).toLocaleDateString()} | Location: {event.location}
              </Typography>
              {event.status === 'pending' && (
                <div>
                  <Button variant="outlined" size="small" sx={{ mr: 1 }} disabled>Edit</Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(event.id)}>Delete</Button>
                </div>
              )}
            </CardActions>
          </Card>
        )))}
      </Box>

      {/* Create Event Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="title" label="Title" type="text" fullWidth variant="outlined" onChange={handleFormChange} sx={{ mt: 1 }} />
          <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" onChange={handleFormChange} sx={{ mt: 1 }} />
          <TextField margin="dense" name="date" label="Date" type="datetime-local" fullWidth variant="outlined" onChange={handleFormChange} InputLabelProps={{ shrink: true }} sx={{ mt: 1 }} />
          <TextField margin="dense" name="location" label="Location" type="text" fullWidth variant="outlined" onChange={handleFormChange} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}