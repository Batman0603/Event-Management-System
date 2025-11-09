import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// Mock data for events
const upcomingEvents = [
  { id: 1, name: 'Annual Tech Fest 2024', date: '2024-10-15', location: 'Main Auditorium' },
  { id: 2, name: 'Career Development Workshop', date: '2024-11-05', location: 'Hall C' },
];

const allEvents = [
  { id: 3, name: 'Music Concert', date: '2024-10-20', location: 'Open Air Theatre' },
  { id: 4, name: 'Art Exhibition', date: '2024-11-12', location: 'Fine Arts Gallery' },
  { id: 5, name: 'Sports Day', date: '2024-12-01', location: 'University Grounds' },
];

const dashboardStyles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  welcomeMessage: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '15px',
  },
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  eventCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  eventTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  eventDetails: {
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div style={dashboardStyles.container}>
      <header style={dashboardStyles.header}>
        <h1 style={dashboardStyles.welcomeMessage}>
          Welcome, {user?.name || 'Student'}!
        </h1>
      </header>

      <section style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>My Upcoming Events</h2>
        <div style={dashboardStyles.eventGrid}>
          {upcomingEvents.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} style={dashboardStyles.eventCard}>
              <h3 style={dashboardStyles.eventTitle}>{event.name}</h3>
              <p style={dashboardStyles.eventDetails}>{event.date} - {event.location}</p>
            </Link>
          ))}
        </div>
      </section>

      <section style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>Browse Events</h2>
        <div style={dashboardStyles.eventGrid}>
          {allEvents.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} style={dashboardStyles.eventCard}>
              <h3 style={dashboardStyles.eventTitle}>{event.name}</h3>
              <p style={dashboardStyles.eventDetails}>{event.date} - {event.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}