import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { getAllEvents, getRegistrationsForEvent } from '../../services/eventService';

const EventRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const eventsData = await getAllEvents();
      setEvents(eventsData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch events.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventChange = async (event) => {
    const eventId = event.target.value;
    setSelectedEvent(eventId);

    if (!eventId) {
      setRegistrations([]);
      return;
    }

    try {
      setLoadingRegistrations(true);
      setError(null);
      const registrationData = await getRegistrationsForEvent(eventId);
      setRegistrations(registrationData || []);
    } catch (err) {
      setError(err.message || `Failed to fetch registrations for event ${eventId}.`);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Event Registrations
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="event-select-label">Select an Event</InputLabel>
        <Select
          labelId="event-select-label"
          id="event-select"
          value={selectedEvent}
          label="Select an Event"
          onChange={handleEventChange}
          disabled={loadingEvents}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loadingRegistrations ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="registrations table">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Registered At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      {selectedEvent ? 'No registrations found for this event.' : 'Please select an event to see registrations.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((reg) => (
                    <TableRow key={reg.user_id}>
                      <TableCell>{reg.user_id}</TableCell>
                      <TableCell>{reg.user_name}</TableCell>
                      <TableCell>{new Date(reg.registered_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default EventRegistrations;