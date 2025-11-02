import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './ProfilePage.css';
import '../components/Modal.css';
import { BRANCH_OPTIONS } from '../utils/constants';
import { FaUser, FaBriefcase, FaGraduationCap, FaTools } from 'react-icons/fa';

// --- THIS IS THE FIX ---
import { useAuth } from '../context/AuthContext';
// --- END OF FIX ---

const emptyExperience = { title: '', company: '', startDate: '', endDate: '', description: '', currentJob: false };
const emptyEducation = { institution: '', degree: '', field: '', startYear: '', endYear: '' };

function ProfilePage() {
  const { user } = useAuth(); // This will now work
  const [profile, setProfile] = useState(null); 
  const [formData, setFormData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [newExperience, setNewExperience] = useState(emptyExperience);
  const [newEducation, setNewEducation] = useState(emptyEducation);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // --- This logic is all correct and unchanged ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        response.data.skills = response.data.skills || [];
        response.data.experience = response.data.experience || [];
        response.data.education = response.data.education || [];
        setProfile(response.data); 
        setFormData(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setMessage('Failed to load profile.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const response = await api.put('/profile/me', formData);
      response.data.skills = response.data.skills || [];
      response.data.experience = response.data.experience || [];
      response.data.education = response.data.education || [];
      setProfile(response.data);
      setFormData(response.data);
      setMessage('Profile updated successfully!');
      setIsEditMode(false); 
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(profile); 
    setIsEditMode(false); 
    setCurrentSkill('');
    setNewExperience(emptyExperience);
    setNewEducation(emptyEducation);
  };
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (currentSkill && !formData.skills.includes(currentSkill)) {
        setFormData({ ...formData, skills: [...formData.skills, currentSkill] });
        setCurrentSkill('');
      }
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(skill => skill !== skillToRemove) });
  };
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience({ ...newExperience, [name]: type === 'checkbox' ? checked : value });
  };
  const handleAddExperience = (e) => {
    e.preventDefault(); 
    setFormData({ ...formData, experience: [newExperience, ...formData.experience] });
    setNewExperience(emptyExperience);
  };
  const handleRemoveExperience = (indexToRemove) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, index) => index !== indexToRemove) });
  };
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };
  const handleAddEducation = (e) => {
    e.preventDefault();
    setFormData({ ...formData, education: [newEducation, ...formData.education] });
    setNewEducation(emptyEducation);
  };
  const handleRemoveEducation = (indexToRemove) => {
    setFormData({ ...formData, education: profile.education.filter((_, index) => index !== indexToRemove) });
  };
  const handleSubmitVerification = async (e) => { 
    e.preventDefault();
    if (!documentUrl || !newEmail) {
      alert("Please provide both a document URL and a new email address.");
      return;
    }
    try {
      await api.post('/verification/request', { 
        documentUrl: documentUrl,
        newEmail: newEmail 
      });
      alert('Verification request submitted! An admin will review it soon.');
      setIsModalOpen(false);
      setDocumentUrl('');
      setNewEmail('');
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert(error.response?.data?.message || 'Failed to submit request.');
      setIsModalOpen(false);
    }
  };
  // --- End of logic ---

  if (loading) { return <div>Loading profile...</div>; }
  if (!profile) { return <div>{message || 'Could not load profile.'}</div>; }

  return (
    <div className="profile-page-new">
      
      {/* --- PROFILE HEADER (Updated) --- */}
      <div className="profile-header">
        <div className="profile-header-left">
          <img
            src={isEditMode ? (formData.profileImageUrl || `https://placehold.co/150x150/e0e0e0/777?text=${formData.name.charAt(0)}`) : (profile.profileImageUrl || `https://placehold.co/150x150/e0e0e0/777?text=${profile.name.charAt(0)}`)}
            alt="Profile"
            className="profile-picture-large"
          />
          <div className="profile-header-info">
            {isEditMode ? (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
            ) : (
              <h1>{profile.name}</h1>
            )}

            {isEditMode ? (
              <div className="form-group">
                <label>Title (e.g., "Software Engineer")</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} />
              </div>
            ) : (
              <p className="profile-header-title">{profile.title || 'No title specified'}</p>
            )}

            {isEditMode ? (
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
              </div>
            ) : (
              <p className="profile-header-location">{profile.location || 'Location not set'}</p>
            )}

            {isEditMode ? (
              <div className="form-group">
                <label>Branch</label>
                <select name="branch" value={formData.branch || ''} onChange={handleChange}>
                  <option value="">Select your branch</option>
                  {BRANCH_OPTIONS.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="profile-header-branch">{profile.branch || 'Branch not set'}</p>
            )}
            
            <div className="profile-header-stats">
              <div className="stat-item">
                <strong>{profile.connectionCount}</strong>
                <span>Connections</span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-header-right">
          {isEditMode ? (
            <div className="edit-mode-buttons">
              <button onClick={handleCancel} className="profile-button cancel">Cancel</button>
              <button onClick={handleSave} className="profile-button save">Save Changes</button>
            </div>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="profile-button edit">
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {isEditMode && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Edit Profile Picture</h3>
          </div>
          <div className="profile-card-content">
            <div className="form-group">
              <label htmlFor="profileImageUrl">Profile Image URL</label>
              <input
                type="text"
                id="profileImageUrl"
                name="profileImageUrl"
                value={formData.profileImageUrl || ''}
                onChange={handleChange}
                placeholder="Paste a URL to a JPG or PNG image (e.g., from Imgur)"
              />
            </div>
          </div>
        </div>
      )}
      
      {profile.role === 'ROLE_STUDENT' && !isEditMode && (
        <div className="verification-banner">
          <p>Graduated? Request to upgrade your account to "Alumni" status.</p>
          <button className="verification-button" onClick={() => setIsModalOpen(true)}>
            Request Alumni Status
          </button>
        </div>
      )}

      {message && <p className="profile-message">{message}</p>}

      <div className="profile-body">
        
        {/* --- ABOUT CARD (Updated) --- */}
        <div className="profile-card">
          <div className="profile-card-header">
            <FaUser className="profile-card-icon" />
            <h3>About</h3>
          </div>
          <div className="profile-card-content">
            {isEditMode ? (
              <div className="form-group">
                <textarea 
                  name="about"
                  value={formData.about || ''} 
                  onChange={handleChange}
                  placeholder="Write a short bio about yourself..."
                  rows="5"
                ></textarea>
              </div>
            ) : (
              <p>{profile.about || 'No bio provided.'}</p>
            )}
          </div>
        </div>

        {/* --- EXPERIENCE CARD (Updated) --- */}
        <div className="profile-card">
          <div className="profile-card-header">
            <FaBriefcase className="profile-card-icon" />
            <h3>Experience</h3>
          </div>
          <div className="profile-card-content">
            {isEditMode && (
              <div className="sub-form">
                <input name="title" value={newExperience.title} onChange={handleExperienceChange} placeholder="Title" />
                <input name="company" value={newExperience.company} onChange={handleExperienceChange} placeholder="Company" />
                <input name="startDate" value={newExperience.startDate} onChange={handleExperienceChange} placeholder="Start Date" />
                <input name="endDate" value={newExperience.endDate} onChange={handleExperienceChange} placeholder="End Date" />
                <textarea name="description" value={newExperience.description} onChange={handleExperienceChange} placeholder="Description..."></textarea>
                <button type="button" className="add-button" onClick={handleAddExperience}>+ Add Experience</button>
              </div>
            )}
            
            <div className="item-list">
              {(isEditMode ? formData.experience : profile.experience).length === 0 && !isEditMode && (
                <p>No experience added.</p>
              )}
              {(isEditMode ? formData.experience : profile.experience).map((exp, index) => (
                <div key={index} className="item-card-view">
                  <div className="item-card-header">
                    <h4>{exp.title} at {exp.company}</h4>
                    {isEditMode && (
                      <button type="button" className="remove-item" onClick={() => handleRemoveExperience(index)}>&times;</button>
                    )}
                  </div>
                  <p>{exp.startDate} - {exp.endDate}</p>
                  <p className="item-description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* --- EDUCATION CARD (Updated) --- */}
        <div className="profile-card">
          <div className="profile-card-header">
            <FaGraduationCap className="profile-card-icon" />
            <h3>Education</h3>
          </div>
          <div className="profile-card-content">
            {isEditMode && (
              <div className="sub-form">
                <input name="institution" value={newEducation.institution} onChange={handleEducationChange} placeholder="Institution" />
                <input name="degree" value={newEducation.degree} onChange={handleEducationChange} placeholder="Degree" />
                <input name="field" value={newEducation.field} onChange={handleEducationChange} placeholder="Field of Study" />
                <input name="startYear" value={newEducation.startYear} onChange={handleEducationChange} placeholder="Start Year" />
                <input name="endYear" value={newEducation.endYear} onChange={handleEducationChange} placeholder="End Year" />
                <button type="button" className="add-button" onClick={handleAddEducation}>+ Add Education</button>
              </div>
            )}
            
            <div className="item-list">
              {(isEditMode ? formData.education : profile.education).length === 0 && !isEditMode && (
                <p>No education added.</p>
              )}
              {(isEditMode ? formData.education : profile.education).map((edu, index) => (
                <div key={index} className="item-card-view">
                  <div className="item-card-header">
                    <h4>{edu.institution}</h4>
                    {isEditMode && (
                      <button type="button" className="remove-item" onClick={() => handleRemoveEducation(index)}>&times;</button>
                    )}
                  </div>
                  <p>{edu.degree} in {edu.field}</p>
                  <p>{edu.startYear} - {edu.endYear}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SKILLS CARD (Updated) --- */}
        <div className="profile-card">
          <div className="profile-card-header">
            <FaTools className="profile-card-icon" />
            <h3>Skills</h3>
          </div>
          <div className="profile-card-content">
            {isEditMode && (
              <div className="skills-input-group">
                <input 
                  type="text" 
                  id="skills" 
                  placeholder="Add a skill and press Enter" 
                  value={currentSkill} 
                  onChange={(e) => setCurrentSkill(e.target.value)} 
                  onKeyDown={handleAddSkill} 
                />
                <button type="button" className="add-skill-button" onClick={handleAddSkill}>Add</button>
              </div>
            )}
            <div className="skills-container-view">
              {(isEditMode ? formData.skills : profile.skills).length === 0 && !isEditMode && (
                <p>No skills added.</p>
              )}
              {(isEditMode ? formData.skills : profile.skills).map((skill, index) => (
                <div key={index} className="skill-tag-view">
                  {skill}
                  {isEditMode && (
                    <button type="button" className="remove-skill" onClick={() => handleRemoveSkill(skill)}>&times;</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- VERIFICATION MODAL (Unchanged) --- */}
      {isModalOpen && (
        <div className="modal-backdrop">
           <div className="modal-content">
            <h3>Request Alumni Status</h3>
            <p>
              To upgrade, please provide a verification document and a new personal email address
              (e.g., @gmail.com) that will become your new login.
            </p>
            <form onSubmit={handleSubmitVerification}>
              <div className="modal-form-group">
                <label htmlFor="newEmail">New Personal Email</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="your-new-email@gmail.com"
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="documentUrl">Document URL</label>
                <input
                  type="text"
                  id="documentUrl"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://example.com/mydocument.pdf"
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-button cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-button submit">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;