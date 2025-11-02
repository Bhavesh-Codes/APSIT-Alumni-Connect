import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import './ConnectionsPage.css';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa'; // --- NEW ICONS ---

function ConnectionsPage() {
  const [view, setView] = useState('connections'); 
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Function to fetch both lists
  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const [connResponse, reqResponse] = await Promise.all([
        api.get('/connections/my-connections'),
        api.get('/connections/requests/pending')
      ]);
      setConnections(connResponse.data);
      setRequests(reqResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch connections data:', error);
      setLoading(false);
      setMessage('Failed to load data.');
    }
  }, []);

  // Fetch data on load
  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // Handler for responding to a request
  const handleResponse = async (requestId, shouldAccept) => {
    setMessage('Processing...');
    try {
      const response = await api.post(`/connections/requests/respond/${requestId}`, {
        accept: shouldAccept,
      });
      setMessage(response.data); 
      fetchPageData(); // Refresh both lists
    } catch (error) {
      console.error('Failed to respond to request:', error);
      setMessage(error.response?.data?.message || 'Failed to respond.');
    }
  };
  
  // Handler for removing a connection
  const handleRemoveConnection = async (userId) => {
    if (window.confirm('Are you sure you want to remove this connection?')) {
      try {
        const response = await api.delete(`/connections/remove/${userId}`);
        setMessage(response.data); 
        fetchPageData(); // Refresh the lists
      } catch (error) {
        console.error('Failed to remove connection:', error);
        setMessage(error.response?.data?.message || 'Failed to remove connection.');
      }
    }
  };


  return (
    // --- NEW: Using shared class names from profile page ---
    <div className="profile-page-new"> 
      {message && <p className="profile-message">{message}</p>}

      {/* --- TABS --- */}
      <div className="view-toggle">
        <button
          className={view === 'connections' ? 'active' : ''}
          onClick={() => setView('connections')}
        >
          My Connections ({connections.length})
        </button>
        <button
          className={view === 'requests' ? 'active' : ''}
          onClick={() => setView('requests')}
        >
          Pending Requests ({requests.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <>
          {/* --- VIEW 1: MY CONNECTIONS --- */}
          {view === 'connections' && (
            <div className="profile-card"> {/* Use the card style */}
              <div className="profile-card-header">
                <h3>My Connections</h3>
              </div>
              <div className="profile-card-content">
                <div className="connections-list-new">
                  {connections.length === 0 ? (
                    <p>You have no connections. <Link to="/network">Browse the network</Link> to find users!</p>
                  ) : (
                    connections.map(user => (
                      <div key={user.id} className="connection-card-new">
                        <img 
                          src={user.profileImageUrl || `https://placehold.co/80x80/e0e0e0/777?text=${user.name.charAt(0)}`} 
                          alt={user.name} 
                          className="connection-img-new"
                        />
                        <div className="connection-info-new">
                          <h3 className="connection-name-new">{user.name}</h3>
                          <p className="connection-title-new">{user.title || 'APSIT User'}</p>
                          <p className="connection-branch-new">{user.branch || ''}</p>
                        </div>
                        <div className="connection-actions-new">
                          <button 
                            className="connection-button-new remove"
                            onClick={() => handleRemoveConnection(user.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 2: PENDING REQUESTS --- */}
          {view === 'requests' && (
            <div className="profile-card"> {/* Use the card style */}
              <div className="profile-card-header">
                <h3>Pending Requests</h3>
              </div>
              <div className="profile-card-content">
                <div className="requests-list-new">
                  {requests.length === 0 ? (
                    <p>You have no pending connection requests.</p>
                  ) : (
                    requests.map(req => (
                      <div key={req.id} className="request-card-new">
                        <img 
                          src={req.fromUser.profileImageUrl || `https://placehold.co/80x80/e0e0e0/777?text=${req.fromUser.name.charAt(0)}`} 
                          alt={req.fromUser.name} 
                          className="connection-img-new"
                        />
                        <div className="request-info-new">
                          <h3 className="request-name-new">{req.fromUser.name}</h3>
                          <p className="request-title-new">{req.fromUser.title || 'APSIT User'}</p>
                        </div>
                        <div className="request-actions-new">
                          <button 
                            className="request-button-new accept"
                            onClick={() => handleResponse(req.id, true)}
                          >
                            <FaCheck /> Accept
                          </button>
                          <button 
                            className="request-button-new reject"
                            onClick={() => handleResponse(req.id, false)}
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ConnectionsPage;