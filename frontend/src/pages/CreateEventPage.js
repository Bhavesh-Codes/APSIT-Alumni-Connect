import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './FormPages.css'; // We can reuse our existing form CSS!

function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Networking',
    description: '',
    maxAttendees: 50
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseInt(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating event...');
    try {
      await api.post('/events', formData);
      setMessage('Event created successfully!');
      // Redirect to the main events page after a short delay
      setTimeout(() => {
        navigate('/events');
      }, 1500);
    } catch (error) {
      console.error('Failed to create event:', error);
      setMessage(error.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <div className="form-page">
      <h2>Create a New Event</h2>
      <p>Organize an event for the APSIT community.</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="text" id="date" name="date" value={formData.date} onChange={handleChange} placeholder="e.g., 2025-12-25" />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} placeholder="e.g., 7:00 PM" />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Online or APSIT Campus" />
        </div>
        <div className="form-group">
          <label htmlFor="type">Event Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="Networking">Networking</option>
            <option value="Webinar">Webinar</option>
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="maxAttendees">Max Attendees</label>
          <input type="number" id="maxAttendees" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="5"></textarea>
        </div>
        
        <button type="submit" className="form-button">Create Event</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default CreateEventPage;