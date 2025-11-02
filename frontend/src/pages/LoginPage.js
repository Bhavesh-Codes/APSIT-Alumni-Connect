import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LOGO_URL = "https://admission.apsit.org.in/cloud/form2/LOGO.png";
const API_URL = 'http://localhost:8080/api/auth';

// --- NEW: Validation Functions ---
const validateName = (name) => {
  if (/\d/.test(name)) { // This is a regex that checks for any digit (0-9)
    return 'Name must not contain numbers.';
  }
  return ''; // No error
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain a lowercase letter.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain an uppercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain a number.';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Password must contain a special character (@$!%*?&).';
  }
  return ''; // No error
};
// --- END NEW ---

function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('ROLE_STUDENT');
  const [regDocumentUrl, setRegDocumentUrl] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // For general errors (like API)
  const [message, setMessage] = useState('');

  // --- NEW: State for real-time validation ---
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // --- END NEW ---

  const navigate = useNavigate();
  const auth = useAuth();

  // --- NEW: Real-time validation for Name ---
  useEffect(() => {
    if (!isLoginView && regName) { // Only run in register view when name is not empty
      setNameError(validateName(regName));
    } else {
      setNameError('');
    }
  }, [regName, isLoginView]);

  // --- NEW: Real-time validation for Password ---
  useEffect(() => {
    if (!isLoginView && regPassword) { // Only in register view
      setPasswordError(validatePassword(regPassword));
    } else {
      setPasswordError('');
    }
  }, [regPassword, isLoginView]);
  // --- END NEW ---

  const toggleView = (view) => {
    setIsLoginView(view);
    // Clear all state
    setLoginEmail('');
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegRole('ROLE_STUDENT');
    setRegDocumentUrl('');
    setError('');
    setMessage('');
    setShowPassword(false);
    // Clear validation errors
    setNameError('');
    setPasswordError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await auth.login(loginEmail, loginPassword);
      const userRole = JSON.parse(localStorage.getItem('user'))?.role;
      
      if (userRole === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
      
    } catch (apiError) {
      console.error('Login error:', apiError);
      if (apiError.response && apiError.response.data && apiError.response.data.message.includes("not active")) {
        setError('Your account is not active. Please wait for admin approval.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // --- NEW: Final validation check before submit ---
    const finalNameError = validateName(regName);
    const finalPasswordError = validatePassword(regPassword);
    
    if (finalNameError) {
      setError(finalNameError); // Show in main error box
      return;
    }
    if (finalPasswordError) {
      setError(finalPasswordError);
      return;
    }
    // --- END NEW ---

    if (regRole === 'ROLE_STUDENT' && !regEmail.endsWith('@apsit.edu.in')) {
      setError('Student registration requires an email ending with @apsit.edu.in');
      return;
    }
    if (regRole === 'ROLE_ALUMNI' && (!regDocumentUrl || regDocumentUrl.trim() === '')) {
      setError('Alumni registration requires a Document URL for verification.');
      return;
    }
    try {
      const registerData = {
        name: regName,
        email: regEmail,
        password: regPassword,
        documentUrl: regRole === 'ROLE_ALUMNI' ? regDocumentUrl : null
      };
      await axios.post(`${API_URL}/register`, registerData);
      setMessage('Registration successful! Please log in.');
      toggleView(true);
    } catch (apiError) {
      console.error('Registration error:', apiError);
      setError(apiError.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        <img src={LOGO_URL} alt="APSIT Logo" className="login-logo" />

        <div className="view-toggle">
          <button 
            className={isLoginView ? 'active' : ''} 
            onClick={() => toggleView(true)}
          >
            Login
          </button>
          <button 
            className={!isLoginView ? 'active' : ''} 
            onClick={() => toggleView(false)}
          >
            Register
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {isLoginView && (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group password-group">
              <label htmlFor="login-password">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="login-password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        )}

        {!isLoginView && (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input type="text" id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
              {/* --- NEW: Real-time error message --- */}
              {nameError && <p className="validation-message error">{nameError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input type="email" id="reg-email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>
            <div className="form-group password-group">
              <label htmlFor="reg-password">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="reg-password" 
                value={regPassword} 
                onChange={(e) => setRegPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {/* --- NEW: Real-time error message --- */}
              {passwordError && <p className="validation-message error">{passwordError}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-role">Register as:</label>
              <select id="reg-role" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                <option value="ROLE_STUDENT">Student (@apsit.edu.in)</option>
                <option value="ROLE_ALUMNI">Alumni (Other email)</option>
              </select>
            </div>

            {regRole === 'ROLE_ALUMNI' && (
              <div className="form-group alumni-field">
                <label htmlFor="reg-doc-url">Document URL</label>
                <p className="field-description">
                  Alumni must provide a link to a verification document (e.g., Marksheet, ID Card). Your account will be active after admin approval.
                </p>
                <input type="text" id="reg-doc-url" value={regDocumentUrl} onChange={(e) => setRegDocumentUrl(e.target.value)} required />
              </div>
            )}
            
            <button type="submit" className="login-button">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;