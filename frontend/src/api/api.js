import axios from 'axios';

// 1. Create a new axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Our secured base URL
});

// 2. Add an "interceptor"
// This is a function that "intercepts" every request before it's sent.
api.interceptors.request.use(
  (config) => {
    // 3. Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // 4. If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;