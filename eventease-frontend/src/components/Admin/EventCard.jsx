import React from "react";
import "./EventCard.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const EventCard = ({
  event,
  showRegisterButton = true,
  onRegister,
  onUpdate,
  onDelete,
  isAdminView = false,
  children, // To allow adding extra content like feedback buttons
}) => {
  const { title, description, date, location, name } = event;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? "Invalid Date"
      : parsedDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="event-card">
      <div className="event-details">
        <h3>{title || name || "Untitled Event"}</h3>
        {description && <p>{description}</p>}

        <div className="event-info">
          <p>
            <strong>Location:</strong> {location || "Not specified"}
          </p>
          <p>
            <strong>Time:</strong> {formatDate(date)}
          </p>
        </div>

        {showRegisterButton && (
          <button
            className="register-button"
            onClick={() => onRegister && onRegister(event.id)}
          >
            Register
          </button>
        )}

        {isAdminView && (
          <Box className="admin-actions" sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => onUpdate && onUpdate(event.id)}>
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={() => onDelete && onDelete(event.id)}>
              Delete
            </Button>
          </Box>
        )}
        {children}
      </div>
    </div>
  );
};

export default EventCard;