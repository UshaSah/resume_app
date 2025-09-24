import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeSelector.css'; // Reuse existing styles

// API configuration
const API_BASE_URL = 'http://54.221.116.49:3000';

const Dashboard = ({ user, setUser }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  // Fetch user's resumes from API
  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/resumes`, {
        headers: {
          'Authorization': `Bearer ${user?.token}` // Add auth header when you implement JWT
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }

      const data = await response.json();
      setResumes(data.data || []);

    } catch (error) {
      setError(error.message);
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format resume display name for the list
  const getResumeDisplayName = (resume) => {
    const name = resume.generalInfo?.fullName || 'Unknown';
    const company = resume.experienceInfo?.company || 'No Company';
    const version = resume.currentVersion || 1;
    const date = new Date(resume.createdAt).toLocaleDateString();
    return `${name} - ${company} (v${version}) - ${date}`;
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear stored user data
    navigate('/login');
  };

  // Navigation handlers
  const handleCreateResume = () => {
    navigate('/form');
  };

  const handleViewResume = (resumeId) => {
    navigate(`/resume/${resumeId}`);
  };

  const handleEditResume = (resumeId) => {
    navigate(`/form/${resumeId}`);
  };

  const handleViewVersions = (resumeId) => {
    navigate(`/versions/${resumeId}`);
  };

  if (loading) {
    return (
      <div className="resume-selector">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="loading">
          <h2>Loading your resumes...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-selector">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="resume-selector">
      {/* Header with user greeting and logout */}
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Quick stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{resumes.length}</h3>
          <p>Total Resumes</p>
        </div>
        <div className="stat-card">
          <h3>{resumes.reduce((sum, r) => sum + (r.currentVersion || 1), 0)}</h3>
          <p>Total Versions</p>
        </div>
      </div>

      {/* Create new resume button */}
      <div className="create-section">
        <button onClick={handleCreateResume} className="create-resume-btn">
          + Create New Resume
        </button>
      </div>

      {/* Resume list */}
      <div className="resume-list-section">
        <h2>My Resumes</h2>
        
        {resumes.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any resumes yet.</p>
            <button onClick={handleCreateResume} className="create-resume-btn">
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map((resume) => (
              <div key={resume._id} className="resume-card">
                <div className="resume-info">
                  <h3>{resume.title || getResumeDisplayName(resume)}</h3>
                  <p className="resume-meta">
                    Version {resume.currentVersion || 1} • 
                    Created {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                  <p className="resume-preview">
                    {resume.generalInfo?.fullName} • {resume.experienceInfo?.company}
                  </p>
                </div>
                
                <div className="resume-actions">
                  <button 
                    onClick={() => handleViewResume(resume._id)}
                    className="action-btn view-btn"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEditResume(resume._id)}
                    className="action-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleViewVersions(resume._id)}
                    className="action-btn versions-btn"
                  >
                    Versions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
