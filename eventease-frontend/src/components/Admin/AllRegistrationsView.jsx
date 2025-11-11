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
  TextField,
  TablePagination,
  debounce,
} from '@mui/material';
import { getAllEvents, getAllRegistrations } from '../../services/eventService';

const AllRegistrationsView = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for controls
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all events for the filter dropdown
  const fetchEvents = useCallback(async () => {
    try {
      const eventsData = await getAllEvents();
      setEvents(eventsData || []);
    } catch (err) {
      // Non-critical error, so we just log it
      console.error('Failed to fetch events for filter:', err);
    }
  }, []);

  // Fetch registrations based on current filters and pagination
  const fetchRegistrations = useCallback(async (page, limit, eventId, search) => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        ...(eventId && { event_id: eventId }),
        ...(search && { search }),
      };
      const response = await getAllRegistrations(params);
      setRegistrations(response.registrations || []);
      setTotal(response.total || 0);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch registrations.');
      setRegistrations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((...args) => fetchRegistrations(...args), 500),
    [fetchRegistrations]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    debouncedFetch(page, rowsPerPage, selectedEvent, searchTerm);
  }, [page, rowsPerPage, selectedEvent, searchTerm, debouncedFetch]);

  const handleEventChange = (event) => {
    setPage(0);
    setSelectedEvent(event.target.value);
  };

  const handleSearchChange = (event) => {
    setPage(0);
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Event Registrations
      </Typography>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search by User or Event"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl fullWidth>
          <InputLabel id="event-filter-label">Filter by Event</InputLabel>
          <Select
            labelId="event-filter-label"
            value={selectedEvent}
            label="Filter by Event"
            onChange={handleEventChange}
          >
            <MenuItem value="">
              <em>All Events</em>
            </MenuItem>
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="all registrations table">
            <TableHead>
              <TableRow>
                <TableCell>Registration ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Event Title</TableCell>
                <TableCell>Registered At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
              ) : registrations.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">No registrations found.</TableCell></TableRow>
              ) : (
                registrations.map((reg) => (
                  <TableRow hover key={reg.registration_id}>
                    <TableCell>{reg.registration_id}</TableCell>
                    <TableCell>{reg.user_name}</TableCell>
                    <TableCell>{reg.event_title}</TableCell>
                    <TableCell>{new Date(reg.registered_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AllRegistrationsView;