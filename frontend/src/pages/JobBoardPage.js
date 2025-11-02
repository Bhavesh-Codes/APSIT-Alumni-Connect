import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './JobBoardPage.css';
import { useAuth } from '../context/AuthContext';
// --- NEW ICONS ---
import { FaBuilding, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth(); // Get the current user

  // Function to fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setLoading(false);
      setMessage('Failed to load jobs.');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handler for deleting a job (Admin)
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setMessage('Job deleted successfully.');
        fetchJobs(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete job:', error);
        setMessage('Failed to delete job.');
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading job board...</div>;
  }

  return (
    // --- NEW: Using shared class name for padding ---
    <div className="profile-page-new"> 
      <div className="job-board-header">
        <h2>Job Board</h2>
        <p>Find opportunities shared by the APSIT alumni community.</p>
      </div>
      {message && <p className="job-board-message">{message}</p>}
      
      <div className="job-list-new">
        {jobs.length === 0 ? (
          <div className="profile-card">
            <div className="profile-card-content">
              <p>No jobs posted at the moment. Check back soon!</p>
            </div>
          </div>
        ) : (
          jobs.map(job => (
            // --- NEW: Using profile-card style ---
            <div key={job.id} className="profile-card">
              <div className="job-card-header-new">
                <h3 className="job-card-title-new">{job.title}</h3>
                <span className="job-card-posted-by">
                  Posted by: {job.postedByName}
                </span>
              </div>
              
              <div className="job-card-info-new">
                <span className="info-item">
                  <FaBuilding /> {job.company}
                </span>
                <span className="info-item">
                  <FaMapMarkerAlt /> {job.location || 'N/A'}
                </span>
                <span className="info-item">
                  <FaTag /> {job.type}
                </span>
              </div>
              
              <div className="job-card-details-new">
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Requirements:</strong> {job.requirements}</p>
              </div>
              
              <div className="job-card-footer-new">
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Apply by:</strong> {job.applicationDeadline}</p>
              </div>

              {/* Admin Delete Button */}
              {user && user.role === 'ROLE_ADMIN' && (
                <div className="admin-action-bar">
                  <button 
                    className="admin-delete-button"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete Post
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

export default JobBoardPage;