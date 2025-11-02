import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './AdminVerificationPage.css'; // We'll create this CSS

function AdminVerificationPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Function to fetch pending requests
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      // 1. Call our /admin/pending endpoint
      const response = await api.get('/verification/admin/pending');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setLoading(false);
    }
  };

  // Fetch requests when the page loads
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Handler for approving or rejecting
  const handleReview = async (requestId, isApproved) => {
    setMessage('Processing...');
    try {
      // 2. Call our /admin/review endpoint
      await api.post(`/verification/admin/review/${requestId}`, {
        isApproved: isApproved,
      });
      setMessage(`Request ${isApproved ? 'approved' : 'rejected'} successfully.`);
      // 3. Refresh the list
      fetchPendingRequests();
    } catch (error) {
      console.error('Failed to review request:', error);
      setMessage('Failed to process request.');
    }
  };

  if (loading) {
    return <div>Loading pending requests...</div>;
  }

  return (
    <div className="admin-verification-page">
      <h2>Verification Requests</h2>
      {message && <p className="verification-message">{message}</p>}
      <div className="verification-list">
        {requests.length === 0 ? (
          <p>No pending verification requests.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="verification-card">
              <div className="verification-info">
                <h3>{req.userName}</h3>
                <p><strong>Email:</strong> {req.userEmail}</p>
                <p><strong>User ID:</strong> {req.userId}</p>
                <p><strong>Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
                <a href={req.documentUrl} target="_blank" rel="noopener noreferrer" className="document-link">
                  View Document
                </a>
              </div>
              <div className="verification-actions">
                <button 
                  className="verification-button approve"
                  onClick={() => handleReview(req.id, true)}
                >
                  Approve
                </button>
                <button 
                  className="verification-button reject"
                  onClick={() => handleReview(req.id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminVerificationPage;