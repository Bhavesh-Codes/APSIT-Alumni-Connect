import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import './AdminUserListPage.css';
import { BRANCH_OPTIONS } from '../utils/constants'; // --- NEW IMPORT ---

function AdminUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // For success/error messages

  // --- NEW SEARCH STATE ---
  const [searchName, setSearchName] = useState('');
  const [searchBranch, setSearchBranch] = useState('');

  // --- UPDATED FETCH FUNCTION ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (searchBranch) params.branch = searchBranch;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
      setMessage('Failed to load users.');
    }
  }, [searchName, searchBranch]); // Dependencies

  useEffect(() => {
    // Debounce search
    const searchTimeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [fetchUsers]);
  // --- END UPDATED FETCH ---

  // --- NEW DELETE HANDLER ---
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE ${userName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setMessage(`User ${userName} deleted successfully.`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete user:', error);
        setMessage(error.response?.data?.message || 'Failed to delete user.');
      }
    }
  };
  // --- END NEW HANDLER ---

  if (loading) {
    return <div>Loading user list...</div>;
  }

  return (
    <div className="admin-user-page">
      <h2>Platform User List (Students & Alumni)</h2>

      {/* --- NEW SEARCH BAR --- */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name..."
          className="search-input"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select 
          className="search-select" 
          value={searchBranch} 
          onChange={(e) => setSearchBranch(e.target.value)}
        >
          <option value="">All Branches</option>
          {BRANCH_OPTIONS.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      {/* --- END NEW SEARCH BAR --- */}

      {message && <p className="admin-user-message">{message}</p>}

      <div className="user-list-container">
        {users.length === 0 ? (
          <p>No users found matching your search.</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="admin-user-card">
              <div className="admin-user-header">
                <h3>{user.name} ({user.role.replace('ROLE_', '')})</h3>
                <p>{user.email}</p>
              </div>
              <div className="admin-user-details">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Title:</strong> {user.title || 'N/A'}</p>
                <p><strong>Company:</strong> {user.company || 'N/A'}</p>
                <p><strong>Branch:</strong> {user.branch || 'N/A'}</p>
                <p><strong>Grad Year:</strong> {user.graduationYear || 'N/A'}</p>
                <p><strong>Skills:</strong> {user.skills?.join(', ') || 'N/A'}</p>
              </div>
              
              {/* --- NEW DELETE BUTTON --- */}
              <div className="admin-user-actions">
                <button 
                  className="admin-delete-button"
                  onClick={() => handleDeleteUser(user.id, user.name)}
                >
                  Delete User
                </button>
              </div>
              {/* --- END NEW DELETE BUTTON --- */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminUserListPage;