import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './FormPages.css'; // We'll create a shared CSS file

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    applicationDeadline: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Posting job...');
    try {
      await api.post('/jobs', formData);
      setMessage('Job posted successfully!');
      // Redirect to the main job board after a short delay
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (error) {
      console.error('Failed to post job:', error);
      setMessage(error.response?.data?.message || 'Failed to post job.');
    }
  };

  return (
    <div className="form-page">
      <h2>Post a New Job Opportunity</h2>
      <p>Share a job with the APSIT community.</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="type">Job Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="salary">Salary (e.g., "Competitive", "$100k")</label>
          <input type="text" id="salary" name="salary" value={formData.salary} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="applicationDeadline">Application Deadline</label>
          <input type="text" id="applicationDeadline" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="5"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="requirements">Requirements</label>
          <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows="5"></textarea>
        </div>
        
        <button type="submit" className="form-button">Post Job</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}

export default PostJobPage;