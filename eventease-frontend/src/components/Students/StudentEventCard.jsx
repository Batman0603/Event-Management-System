import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const StudentEventCard = ({
  event,
  isRegistered,
  onRegister,
  onUnregister,
  onGiveFeedback,
  showGiveFeedback = false,
}) => {
  const { title, description, date, location, max_seats, seats_booked } = event;

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventFull = seats_booked >= max_seats;

  return (
    <Card elevation={3} sx={{ borderRadius: "12px" }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, color: "text.secondary" }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{location || "Location not specified"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "text.secondary" }}>
          <EventAvailableIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{formatDate(date)}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Chip label={`${seats_booked || 0} / ${max_seats || 'N/A'} Seats`} />
        <Box>
          {onRegister && !isRegistered && (
            <Button variant="contained" color="primary" onClick={() => onRegister(event.id)} disabled={isEventFull}>
              {isEventFull ? "Full" : "Register"}
            </Button>
          )}
          {onUnregister && isRegistered && (
            <Button variant="outlined" color="secondary" onClick={() => onUnregister(event.id)}>
              Unregister
            </Button>
          )}
          {showGiveFeedback && onGiveFeedback && isRegistered && (
            <Button variant="contained" color="info" onClick={onGiveFeedback} sx={{ ml: 1 }}>
              Give Feedback
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default StudentEventCard;