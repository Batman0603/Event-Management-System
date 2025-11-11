import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getFeedbackForMyEvents } from "../../services/feedbackService";

export default function ClubAdminFeedbackView() {
  const [eventFeedback, setEventFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const feedbackData = await getFeedbackForMyEvents();
      setEventFeedback(feedbackData?.feedbacks || []);
    } catch (err) {
      setError(err.message || "Failed to fetch feedback for your events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Feedback on Your Events
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="event feedback table">
            <TableHead>
              <TableRow>
                <TableCell>Event Title</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
              ) : eventFeedback.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No feedback has been submitted for your events yet.</TableCell></TableRow>
              ) : (
                eventFeedback.map((fb) => (
                  <TableRow hover key={fb.id}>
                    <TableCell>{fb.event_title}</TableCell>
                    <TableCell>{fb.user_name}</TableCell>
                    <TableCell>
                      <Rating value={fb.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>{fb.message}</TableCell>
                    <TableCell>{new Date(fb.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}