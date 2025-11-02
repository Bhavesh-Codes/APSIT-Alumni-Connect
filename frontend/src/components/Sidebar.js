import React from 'react';
// --- NEW: Use NavLink for active styling ---
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css'; // We will create this
import { 
  FaHome, FaUser, FaUsers, FaLink, FaBriefcase, FaCalendarAlt, 
  FaPlus, FaSignOutAlt, FaChartBar, FaCheckSquare 
} from 'react-icons/fa';

const LOGO_URL = "https://admission.apsit.org.in/cloud/form2/LOGO.png";

function Sidebar() {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link to={user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/home'}>
          <img src={LOGO_URL} alt="APSIT Logo" className="sidebar-logo" />
        </Link>
        <span className="sidebar-title">APSIT Alumni Connect</span>
      </div>

      <div className="sidebar-links">
        {/* --- STUDENT & ALUMNI LINKS --- */}
        {user && (user.role === 'ROLE_STUDENT' || user.role === 'ROLE_ALUMNI') && (
          <>
            <NavLink to="/home" className="sidebar-link">
              <FaHome /> <span>Home</span>
            </NavLink>
            <NavLink to="/profile" className="sidebar-link">
              <FaUser /> <span>Profile</span>
            </NavLink>
            <NavLink to="/network" className="sidebar-link">
              <FaUsers /> <span>Network</span>
            </NavLink>
            <NavLink to="/connections" className="sidebar-link">
              <FaLink /> <span>Connections</span>
            </NavLink>
            <NavLink to="/jobs" className="sidebar-link">
              <FaBriefcase /> <span>Job Board</span>
            </NavLink>
            <NavLink to="/events" className="sidebar-link">
              <FaCalendarAlt /> <span>Events</span>
            </NavLink>
          </>
        )}
        
        {/* --- ALUMNI-ONLY LINKS --- */}
        {user && user.role === 'ROLE_ALUMNI' && (
          <>
            <NavLink to="/post-job" className="sidebar-link special">
              <FaPlus /> <span>Post Job</span>
            </NavLink>
            <NavLink to="/create-event" className="sidebar-link special">
              <FaPlus /> <span>Create Event</span>
            </NavLink>
          </>
        )}

        {/* --- ADMIN-ONLY LINKS --- */}
        {user && user.role === 'ROLE_ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" className="sidebar-link">
              <FaChartBar /> <span>Stats</span>
            </NavLink>
            <NavLink to="/admin/verification" className="sidebar-link">
              <FaCheckSquare /> <span>Verify Users</span>
            </NavLink>
            <NavLink to="/admin/users" className="sidebar-link">
              <FaUsers /> <span>View Users</span>
            </NavLink>
            <NavLink to="/jobs" className="sidebar-link">
              <FaBriefcase /> <span>Job Board</span>
            </NavLink>
            <NavLink to="/events" className="sidebar-link">
              <FaCalendarAlt /> <span>Events</span>
            </NavLink>
          </>
        )}
      </div>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link logout">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
