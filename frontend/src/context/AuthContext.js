import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Get user/token from localStorage, or set to null
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // To prevent "flicker"

  // 2. This 'useEffect' runs *once* when the app loads
  useEffect(() => {
    // When the app loads, we set the 'token' and 'user' from
    // localStorage. This keeps the user logged in on refresh.
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Tell axios to use this token for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []); // The empty array [] means "run only once"


  // 3. Login Function
  const login = async (email, password) => {
    // We're returning the response (or error)
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { jwtToken, user } = response.data;

      // Update state
      setToken(jwtToken);
      setUser(user);

      // Set auth header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

      // Store in localStorage
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(user));

      return response; // Return success
    } catch (error) {
      // If login fails, throw the error
      throw error;
    }
  };

  // 4. Logout Function
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];

    // Clear from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 5. The shared "value"
  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!token, // A handy boolean: true if token exists, false if not
  };
  
  // Don't render the app until we've checked localStorage
  if (loading) {
    return <div>Loading...</div>; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The custom hook
export function useAuth() {
  return useContext(AuthContext);
}