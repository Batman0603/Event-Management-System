import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getEventsByCreator, createEvent, deleteEvent, updateEvent, getEventById } from "../../services/eventService";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from "@mui/material/Alert";
import EventCard from "../../components/Admin/EventCard.jsx";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    location: "",
    max_seats: 100,
  });
 
  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getEventsByCreator();
      setMyEvents(eventData?.events || []);
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

  const handleEditFormChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const handleOpenEditModal = async (eventId) => {
    try {
      const response = await getEventById(eventId);
      const eventData = response.data;
      setEditFormData({
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date, // Assumes backend sends a compatible date string
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
      fetchMyEvents(); // Refresh list
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {loading ? <Typography>Loading your events...</Typography> : myEvents.length === 0 && !error ? (
          <Typography>You have not created any events yet.</Typography>
        ) : (
          myEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showRegisterButton={false}
              isAdminView={true} // Show admin actions
              onDelete={() => handleDelete(event.id)}
              onUpdate={() => handleOpenEditModal(event.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Status: {getStatusChip(event.status)}
                </Typography>
                {event.status === 'pending' && (
                  <Typography variant="caption" color="text.secondary">
                    Awaiting Admin Approval
                  </Typography>
                )}
                {event.status === 'approved' && (
                  <Button size="small" onClick={() => navigate('/dash/club-admin/attendees')}>View Attendees</Button>
                )}
              </Box>
            </EventCard>
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

      {/* Update Event Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
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
          <TextField margin="dense" name="max_seats" label="Max Seats" type="number" fullWidth variant="outlined" value={editFormData.max_seats} onChange={handleEditFormChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleUpdateEvent} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}