import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EventIcon from "@mui/icons-material/Event";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Navbar from "./Navbar";

const drawerWidth = 240;

export default function AppLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  let menuItems = [];
  if (user?.role === 'admin') {
    menuItems = [
      { text: "Events", icon: <EventIcon />, path: "/dash/admin" },
      { text: "Event Registrations", icon: <HowToRegIcon />, path: "/dash/admin/registrations" },
      { text: "Users", icon: <PeopleIcon />, path: "/dash/admin/users" }, // Admin-specific
      { text: "Feedback", icon: <FeedbackIcon />, path: "/dash/admin/feedback" }, // Admin-specific
      { text: "System Logs", icon: <DescriptionIcon />, path: "/dash/admin/logs" }, // Admin-specific
      { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    ];
  } else if (user?.role === 'club_admin') {
    menuItems = [
      { text: "Events", icon: <EventIcon />, path: "/dash/club-admin" },
      { text: "Feedback", icon: <FeedbackIcon />, path: "/my-feedbacks" }, // Club Admin can also give feedback
      { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    ];
  } else {
    menuItems = [
      { text: "Events", icon: <EventIcon />, path: "/dash/student" },
      { text: "My Events", icon: <ListAltIcon />, path: "/my-events" },
      { text: "My Feedbacks", icon: <FeedbackIcon />, path: "/my-feedbacks" },
      { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    ];
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {/* We can reuse the existing Navbar for the top bar content */}
        <Navbar />
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ p: 2, mt: 2, textAlign: "center" }}>
          <Typography variant="h6" component="div">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.department}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({user?.role})
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {/* This Toolbar is a spacer to push content below the AppBar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}