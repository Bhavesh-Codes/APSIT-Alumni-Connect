import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './EventsPage.css';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaCheck } from 'react-icons/fa';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth(); 

  // Function to fetch events (unchanged)
  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoading(false);
      setMessage('Failed to load events.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // Runs once on load

  // --- UPDATED REGISTER HANDLER ---
  const handleRegister = async (eventId) => {
    setMessage(`Registering for event...`);
    try {
      const response = await api.post(`/events/${eventId}/register`);
      setMessage(response.data);
      
      // --- THIS IS THE FIX ---
      // Instead of re-fetching, we manually update the state.
      // This is instant and avoids the race condition.
      setEvents(currentEvents => 
        currentEvents.map(event => {
          if (event.id === eventId) {
            // Find the event we just registered for and update it
            return { ...event, isRegisteredByCurrentUser: true };
          }
          return event;
        })
      );
      // --- END OF FIX ---
      
    } catch (error) {
      console.error('Failed to register for event:', error);
      setMessage(error.response?.data?.message || 'Failed to register.');
    }
  };
  // --- END UPDATED HANDLER ---

  // Handler for deleting an event (Admin - unchanged)
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setMessage('Event deleted successfully.');
        fetchEvents(); // This is fine, admin deletes are slower
      } catch (error) {
        console.error('Failed to delete event:', error);
        setMessage('Failed to delete event.');
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</div>;
  }

  return (
    <div className="profile-page-new">
      <div className="job-board-header"> 
        <h2>Upcoming Events</h2>
        <p>Connect and learn with the APSIT community.</p>
      </div>
      {message && <p className="events-message-new">{message}</p>}
      
      <div className="job-list-new">
        {events.length === 0 ? (
          <div className="profile-card">
            <div className="profile-card-content">
              <p>No events scheduled at the moment. Check back soon!</p>
            </div>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="profile-card">
              <div className="event-card-header-new">
                <h3 className="event-card-title-new">{event.title}</h3>
                <span className="event-card-organizer">
                  By: {event.organizerName}
                </span>
              </div>
              
              <div className="event-card-info-new">
                <span className="info-item">
                  <FaCalendarAlt /> {event.date || 'TBA'}
                </span>
                <span className="info-item">
                  <FaClock /> {event.time || 'TBA'}
                </span>
                <span className="info-item">
                  <FaMapMarkerAlt /> {event.location || 'TBA'}
                </span>
                <span className="info-item">
                  <FaTag /> {event.type}
                </span>
              </div>
              
              <div className="event-card-details-new">
                <p>{event.description}</p>
              </div>
              
              <div className="event-card-footer-new">
                <p><strong>Max Attendees:</strong> {event.maxAttendees || 'N/A'}</p>
                
                {/* --- SMART BUTTON LOGIC (Unchanged, will now work) --- */}
                {user.role !== 'ROLE_ADMIN' && (
                  event.isRegisteredByCurrentUser ? (
                    <button className="event-register-button registered" disabled>
                      <FaCheck /> Registered
                    </button>
                  ) : (
                    <button 
                      className="event-register-button"
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </button>
                  )
                )}
              </div>

              {/* Admin Delete Button (Unchanged) */}
              {user && user.role === 'ROLE_ADMIN' && (
                <div className="admin-action-bar">
                  <button 
                    className="admin-delete-button"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventsPage;