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
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getAllUsers, deleteUser } from "../../services/userService";
import { debounce } from "lodash";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "role", label: "Role", minWidth: 100 },
  { id: "department", label: "Department", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

export default function UserManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = useCallback(
    debounce(async (page, limit, search, role) => {
      setLoading(true);
      try {
        const params = { page: page + 1, limit, search, role };
        const response = await getAllUsers(params);
        // Correctly access the nested data from the API response
        setUsers(response.data.data.users || []);
        setTotalUsers(response.data.data.pagination.total_items || 0);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchUsers(page, rowsPerPage, searchTerm, roleFilter);
  }, [page, rowsPerPage, searchTerm, roleFilter, fetchUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        // Refresh users list
        fetchUsers(page, rowsPerPage, searchTerm, roleFilter);
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleUpdateUser = (userId) => {
    // Placeholder for update logic, e.g., open a modal or navigate
    alert(`Update user with ID: ${userId}`);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Fab
        size="medium"
        color="secondary"
        aria-label="add user"
        sx={{ position: 'absolute', bottom: 40, right: 40 }}
        // onClick={() => navigate('/users/create')} // TODO: Add navigation to create user page
      >
        <AddIcon />
      </Fab>
      <Box sx={{ p: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Search by Name/Email"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={handleRoleFilterChange}>
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="club_admin">Club Admin</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
              users.map((user) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                  {columns.map((column) => {
                    const value = user[column.id];
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton onClick={() => handleUpdateUser(user.id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      );
                    }
                    return <TableCell key={column.id}>{value}</TableCell>;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}