import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // Renamed
import ProfilePage from './pages/ProfilePage';
import AlumniNetworkPage from './pages/AlumniNetworkPage';
import ConnectionsPage from './pages/ConnectionsPage';
import PostJobPage from './pages/PostJobPage';
import JobBoardPage from './pages/JobBoardPage';
import CreateEventPage from './pages/CreateEventPage';
import EventsPage from './pages/EventsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import AdminUserListPage from './pages/AdminUserListPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    // --- THIS IS THE FIX ---
    // We protect the entire App layout.
    // If you are not logged in, you can't see the sidebar.
    // This will redirect you to /login.
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    // --- END OF FIX ---
    children: [
      // Add an "index" route.
      // If you are logged in and go to "/",
      // this is the default page that will load.
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home", // Renamed from "dashboard"
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />, // No more nested protection needed
      },
      {
        path: "network",
        element: <AlumniNetworkPage />, // No more nested protection needed
      },
      {
        path: "connections",
        element: <ConnectionsPage />, // No more nested protection needed
      },
      {
        path: "jobs",
        element: <JobBoardPage />, // No more nested protection needed
      },
      {
        path: "events",
        element: <EventsPage />, // No more nested protection needed
      },
      // --- Role-Based routes still need their wrapper ---
      {
        path: "post-job",
        element: (
          <RoleBasedRoute roleRequired="ROLE_ALUMNI">
            <PostJobPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "create-event",
        element: (
          <RoleBasedRoute roleRequired="ROLE_ALUMNI">
            <CreateEventPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <RoleBasedRoute roleRequired="ROLE_ADMIN">
            <AdminDashboardPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/verification",
        element: (
          <RoleBasedRoute roleRequired="ROLE_ADMIN">
            <AdminVerificationPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <RoleBasedRoute roleRequired="ROLE_ADMIN">
            <AdminUserListPage />
          </RoleBasedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);