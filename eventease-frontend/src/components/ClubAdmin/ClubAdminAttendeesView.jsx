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
import { getEventsByCreator, getRegistrationsForEvent } from '../../services/eventService';

const ClubAdminAttendeesView = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch all events created by the club admin for the dropdown
  const fetchMyEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const response = await getEventsByCreator();
      // The events array is nested in the response
      setMyEvents(response?.events || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your events.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  // 2. Fetch attendees when an event is selected from the dropdown
  const handleEventChange = async (event) => {
    const eventId = event.target.value;
    setSelectedEvent(eventId);

    if (!eventId) {
      setAttendees([]);
      return;
    }

    try {
      setLoadingAttendees(true);
      setError(null);
      const registrationData = await getRegistrationsForEvent(eventId);
      setAttendees(registrationData || []); 
    } catch (err) {
      setError(err.message || `Failed to fetch attendees for event ${eventId}.`);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendees for My Events (Club Admin)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="event-select-label">Select an Event to View Attendees</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent}
          label="Select an Event to View Attendees"
          onChange={handleEventChange}
          disabled={loadingEvents}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {myEvents.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loadingAttendees ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="attendees table">
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Registered At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      {selectedEvent ? 'No attendees found for this event.' : 'Please select an event.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  attendees.map((attendee, index) => (
                    <TableRow key={index}>
                      <TableCell>{attendee.user_name}</TableCell>
                      <TableCell>{new Date(attendee.registered_at).toLocaleString()}</TableCell>
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

export default ClubAdminAttendeesView;