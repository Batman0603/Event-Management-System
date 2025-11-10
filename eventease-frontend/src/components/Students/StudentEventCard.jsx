import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";

const StudentEventCard = ({ event, isRegistered, onRegister, onUnregister }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? "Invalid Date" : parsedDate.toLocaleDateString(undefined, options);
  };

  return (
    <Card elevation={3} sx={{ borderRadius: "12px" }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {event.title || "Untitled Event"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          {event.description || "No description available"}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          pb: 2,
          pt: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {event.location || "Location TBD"}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.date)}
            </Typography>
          </Box>
        </Box>
        <div>
          {isRegistered ? (
            <Button variant="outlined" color="secondary" size="small" onClick={() => onUnregister(event.id)}>Unregister</Button>
          ) : (
            <Button variant="contained" size="small" onClick={() => onRegister(event.id)}>Register</Button>
          )}
        </div>
      </CardActions>
    </Card>
  );
};

export default StudentEventCard;