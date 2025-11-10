import React, { useState, useEffect } from "react";
import { updateMyProfile } from "../services/userService";
import Box from "@mui/material/Box";
import { useUser } from '../context/UserContext.jsx';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// This component will render the skeleton layout while loading
const ProfileSkeleton = () => (
  <Stack spacing={2}>
    <Skeleton variant="text" sx={{ fontSize: '2rem' }} width="40%" />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Skeleton variant="circular" width={100} height={100} />
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width="60%" />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="80%" />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="70%" />
        </Stack>
    </Box>
    <Skeleton variant="rounded" width="100%" height={80} />
  </Stack>
);

export default function Profile() {
  const { user, loadingUser, userError, fetchCurrentUser } = useUser(); // Use global user state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });

  // Initialize form data when user data is available from context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form data to current user data when closing modal without saving
    if (user) {
      setFormData({ name: user.name, email: user.email, department: user.department });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateMyProfile(user.id, formData); // Use user.id from context
      handleCloseModal();
      await fetchCurrentUser(); // Re-fetch global user data to show updated data
    } catch (err) {
      console.error("Error updating profile:", err);
      // You might want to set a local error state here or use a global notification system
    }
  };

  if (loadingUser) {
    return <ProfileSkeleton />;
  }

  if (userError) {  // FIXED: Changed from 'error' to 'userError'
    return <Typography color="error">{userError}</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      {user && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 3 }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Stack spacing={1}>
              <Typography variant="h5" component="div">
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Department:</strong> {user.department}
              </Typography>
              <Typography variant="body1" color="text.secondary"> 
                <strong>Role:</strong> {user.role}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleOpenModal}>
              Update
            </Button>
          </Box>
        </>
      )}

      {/* Update Profile Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="department"
            name="department"
            label="Department"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.department}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}