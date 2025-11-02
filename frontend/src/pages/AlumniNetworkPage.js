import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import './AlumniNetworkPage.css';
import { useAuth } from '../context/AuthContext';
import { BRANCH_OPTIONS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function AlumniNetworkPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [searchRole, setSearchRole] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (searchName) params.name = searchName;
    if (searchBranch) params.branch = searchBranch;
    
    try {
      const response = await api.get('/users', { params });
      let filteredUsers = response.data.filter(u => u.id !== currentUser.id);

      if (searchRole) {
        filteredUsers = filteredUsers.filter(u => u.role === searchRole);
      }
      
      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
      setMessage('Failed to load user network.');
    }
  }, [searchName, searchBranch, searchRole, currentUser.id]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [fetchUsers]);

  const handleConnect = async (toUserId) => {
    setMessage('');
    try {
      const response = await api.post(`/connections/send/${toUserId}`);
      setMessage(response.data);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to send connection request:', error);
      setMessage(error.response?.data?.message || 'Failed to send request.');
    }
  };

  const handleCancelRequest = async (toUserId) => {
    setMessage('');
    try {
      const response = await api.delete(`/connections/cancel/${toUserId}`);
      setMessage(response.data);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to cancel request:', error);
      setMessage(error.response?.data?.message || 'Failed to cancel request.');
    }
  };

  const renderConnectButton = (user) => {
    switch (user.connectionStatus) {
      case 'PENDING_SENT':
        return (
          <button 
            className="user-card-button pending"
            onClick={() => handleCancelRequest(user.id)}
          >
            Pending
          </button>
        );
      case 'PENDING_RECEIVED':
        return (
          <button 
            className="user-card-button received"
            onClick={() => navigate('/connections')} 
          >
            Respond
          </button>
        );
      case 'ACCEPTED':
        return (
          <button className="user-card-button connected" disabled>
            Connected
          </button>
        );
      case 'NONE':
      default:
        return (
          <button 
            className="user-card-button connect"
            onClick={() => handleConnect(user.id)}
          >
            Connect
          </button>
        );
    }
  };

  return (
    <div className="network-page">
      <h2>Alumni & Student Network</h2>

      {/* Search Bar (unchanged) */}
      <div className="search-bar">
        <input type="text" placeholder="Search by name..." className="search-input" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <select className="search-select" value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)}>
          <option value="">All Branches</option>
          {BRANCH_OPTIONS.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
        <select className="search-select" value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
          <option value="">All Users</option>
          <option value="ROLE_STUDENT">Students Only</option>
          <option value="ROLE_ALUMNI">Alumni Only</option>
        </select>
      </div>

      {message && <p className="network-message">{message}</p>}
      
      {loading ? ( <div>Loading network...</div> ) : (
        <div className="user-grid">
          {users.length === 0 ? ( <p>No users found matching your search.</p> ) : (
            users.map(user => (
              <div 
                key={user.id} 
                // We'll keep the class for styling, but not for the border
                className={`user-card ${user.role === 'ROLE_ALUMNI' ? 'alumni' : 'student'}`}
              >
                {/* --- THIS IS THE FIX --- */}
                {/* We are re-adding the badge here */}
                <div className="user-card-role-badge">
                  {user.role === 'ROLE_ALUMNI' ? 'Alumni' : 'Student'}
                </div>
                {/* --- END OF FIX --- */}
                
                <img 
                  src={user.profileImageUrl || `https://placehold.co/100x100/e0e0e0/777?text=${user.name.charAt(0)}`} 
                  alt={`${user.name}'s profile`} 
                  className="user-card-img"
                />
                <h3 className="user-card-name">{user.name}</h3>
                <p className="user-card-branch">{user.branch || 'Branch not specified'}</p>
                <p className="user-card-title">{user.title || (user.role === 'ROLE_ALUMNI' ? 'Alumni' : 'Student')}</p>
                <p className="user-card-company">{user.company || 'APSIT'}</p>
                
                {renderConnectButton(user)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AlumniNetworkPage;