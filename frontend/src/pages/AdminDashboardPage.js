import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './AdminDashboardPage.css';
// --- NEW IMPORTS ---
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell, PieLabel 
} from 'recharts';
// --- END NEW IMPORTS ---

// --- NEW: Define professional colors for our charts ---
const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];
// (Blue, Green, Yellow, Red)

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard statistics...</div>;
  }

  if (!stats) {
    return <div>Could not load statistics.</div>;
  }

  // --- NEW: Transform stats data for our charts ---
  const userRoleData = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Alumni', count: stats.totalAlumni }
  ];

  const contentData = [
    { name: 'Jobs Posted', value: stats.totalJobs },
    { name: 'Events', value: stats.totalEvents },
    { name: 'Pending Verifications', value: stats.pendingVerifications }
  ];
  // --- END NEW DATA ---

  return (
    // --- NEW: Using shared class name for padding ---
    <div className="profile-page-new"> 
      <h2>Admin Dashboard</h2>
      
      {/* --- 1. Stat Cards (Unchanged) --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
          <span>(Students + Alumni)</span>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Alumni</h3>
          <p>{stats.totalAlumni}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Verifications</h3>
          <p>{stats.pendingVerifications}</p>
        </div>
        <div className="stat-card">
          <h3>Total Jobs Posted</h3>
          <p>{stats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{stats.totalEvents}</p>
        </div>
      </div>

      {/* --- 2. NEW Charts Section --- */}
      <div className="chart-grid">
        {/* --- Bar Chart: User Roles --- */}
        <div className="profile-card"> {/* Reuse the card style */}
          <div className="profile-card-header">
            <h3>User Overview</h3>
          </div>
          <div className="profile-card-content chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Pie Chart: Content Overview --- */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Platform Content</h3>
          </div>
          <div className="profile-card-content chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {contentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;