import React, { useState, useEffect, useCallback } from "react";
import { getAllEvents, createEvent, deleteEvent, getEventById, updateEvent } from "../../services/eventService";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add"; 
import IconButton from '@mui/material/IconButton';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "./AdminEventView.css";
import EventCard from "../../components/Admin/EventCard.jsx";

const AdminEventView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the create modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    max_seats: 100,
  });
  const [modalError, setModalError] = useState(null);

  // State for the update modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    location: "",
    max_seats: 100,
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getAllEvents();
      console.log("Fetched Events Response:", fetchedEvents);
      setEvents(fetchedEvents || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
    setFormData({ title: "", description: "", date: "", location: "", max_seats: 100 });
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFormChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.date) {
      setModalError("Title and Date are required.");
      return;
    }
    try {
      await createEvent(formData);
      handleCloseModal();
      fetchEvents(); // Refresh the event list
    } catch (err) {
      setModalError(err.message || "Failed to create event.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        fetchEvents(); // Refresh the event list
      } catch (err) {
        setError(err.message || "Failed to delete event.");
      }
    }
  };

  const handleOpenEditModal = async (eventId) => {
    try {
      const response = await getEventById(eventId);
      const eventData = response.data;
      // The backend sends date as "YYYY-MM-DD HH:MM". The input needs "YYYY-MM-DDTHH:MM".
      const formattedDate = eventData.date ? eventData.date.replace(" ", "T") : "";

      setEditFormData({
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        date: formattedDate,
        location: eventData.location,
        max_seats: eventData.max_seats || 100,
      });
      setIsEditModalOpen(true);
    } catch (err) {
      setError("Failed to fetch event details for editing.");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateEvent = async () => {
    try {
      await updateEvent(editFormData.id, editFormData);
      handleCloseEditModal();
      fetchEvents(); // Refresh list
    } catch (err) {
      alert("Failed to update event.");
    }
  };

  if (loading) return <div className="loading-message">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-event-view">
      <Fab
        size="medium"
        color="secondary"
        aria-label="add event"
        sx={{ position: 'absolute', bottom: 40, right: 40 }}
        onClick={handleOpenModal}
      >
        <AddIcon />
      </Fab>
      <h2>All Events</h2>

      <div className="event-list">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showRegisterButton={false}
              isAdminView={true}
              onDelete={() => handleDeleteEvent(event.id)}
              onUpdate={() => handleOpenEditModal(event.id)}
            />
          ))
        )}
      </div>

      {/* Create Event Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {modalError && <Alert severity="error" sx={{ mb: 2 }}>{modalError}</Alert>}
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="date"
              label="Event Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField margin="dense" name="location" label="Location" type="text" fullWidth variant="outlined" onChange={handleFormChange} />
            <TextField
              margin="dense"
              name="max_seats"
              label="Max Seats"
              type="number"
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              defaultValue={100}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Update Event Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={editFormData.title}
              onChange={handleEditFormChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={editFormData.description}
              onChange={handleEditFormChange}
            />
            <TextField
              margin="dense"
              name="date"
              label="Event Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={editFormData.date}
              onChange={handleEditFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField margin="dense" name="location" label="Location" type="text" fullWidth variant="outlined" value={editFormData.location} onChange={handleEditFormChange} />
            <TextField
              margin="dense"
              name="max_seats"
              label="Max Seats"
              type="number"
              fullWidth
              variant="outlined"
              value={editFormData.max_seats}
              onChange={handleEditFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateEvent} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminEventView;
