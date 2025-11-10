import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  CircularProgress,
  Typography,
  Rating,
} from "@mui/material";
import { getAllFeedback } from "../../services/feedbackService";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "userName", label: "User Name", minWidth: 170 },
  { id: "eventTitle", label: "Event Title", minWidth: 170 },
  { id: "rating", label: "Rating", minWidth: 100, align: "center" },
  { id: "message", label: "Message", minWidth: 200 },
  { id: "createdAt", label: "Created At", minWidth: 150 },
];

export default function FeedbackView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [feedbackList, setFeedbackList] = useState([]);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async (page, limit) => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit };
      const response = await getAllFeedback(params);
      setFeedbackList(response.data.feedback || []);
      setTotalFeedback(response.data.feedback?.length || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch feedback.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback(page, rowsPerPage);
  }, [page, rowsPerPage, fetchFeedback]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              feedbackList.map((feedback) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={feedback.id}>
                  <TableCell>{feedback.id}</TableCell>
                  <TableCell>{feedback.userName}</TableCell>
                  <TableCell>{feedback.eventTitle}</TableCell>
                  <TableCell align="center"><Rating value={feedback.rating} readOnly /></TableCell>
                  <TableCell>{feedback.message}</TableCell>
                  <TableCell>{feedback.createdAt}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalFeedback}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}