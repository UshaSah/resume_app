import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/resumes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          return;
        }
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
      <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.navLeft}>
            <h1 style={styles.logo}>ResumeBuilder</h1>
          </div>
          <div style={styles.navRight}>
            <span style={styles.userInfo}>Welcome, {user?.name || 'User'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h2>Loading your resumes...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <div style={styles.navLeft}>
            <h1 style={styles.logo}>ResumeBuilder</h1>
          </div>
          <div style={styles.navRight}>
            <span style={styles.userInfo}>Welcome, {user?.name || 'User'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
        <div style={styles.errorContainer}>
          <h2 style={{ color: '#e74c3c' }}>Error: {error}</h2>
          <button onClick={fetchResumes} style={styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo}>ResumeBuilder</h1>
          <nav style={styles.navLinks}>
            <button style={styles.navLink}>Dashboard</button>
            <button onClick={handleCreateResume} style={styles.navLink}>Create Resume</button>
          </nav>
        </div>
        <div style={styles.navRight}>
          <div style={styles.authStatus}>
            <span style={styles.statusIndicator}></span>
            <span style={styles.userInfo}>{user?.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>Welcome back, {user?.name || 'User'}!</h1>
          <p style={styles.welcomeSubtitle}>Manage your resumes and track your professional journey</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{resumes.length}</div>
            <div style={styles.statLabel}>Total Resumes</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {resumes.reduce((sum, r) => sum + (r.versions?.length || 1), 0)}
            </div>
            <div style={styles.statLabel}>Total Versions</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {resumes.filter(r => new Date(r.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div style={styles.statLabel}>Updated This Week</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <button onClick={handleCreateResume} style={styles.createBtn}>
            <span style={styles.createIcon}>+</span>
            Create New Resume
          </button>
        </div>

        {/* Resume List */}
        <div style={styles.resumeSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Resumes</h2>
            <span style={styles.resumeCount}>({resumes.length} resumes)</span>
          </div>
          
          {resumes.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first professional resume to get started</p>
              <button onClick={handleCreateResume} style={styles.createBtn}>
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div style={styles.resumeGrid}>
              {resumes.map((resume) => (
                <div key={resume._id} style={styles.resumeCard}>
                  <div style={styles.resumeHeader}>
                    <h3 style={styles.resumeTitle}>
                      {resume.generalInfo?.name || 'Untitled Resume'}
                    </h3>
                    <div style={styles.resumeMeta}>
                      <span style={styles.versionBadge}>
                        v{resume.version || 1}
                      </span>
                      <span style={styles.dateBadge}>
                        {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={styles.resumePreview}>
                    <p><strong>Name:</strong> {resume.generalInfo?.name || 'Not specified'}</p>
                    <p><strong>Email:</strong> {resume.generalInfo?.email || 'Not specified'}</p>
                    <p><strong>Company:</strong> {resume.experienceInfo?.company || 'Not specified'}</p>
                    <p><strong>Position:</strong> {resume.experienceInfo?.position || 'Not specified'}</p>
                  </div>
                  
                  <div style={styles.resumeActions}>
                    <button 
                      onClick={() => handleViewResume(resume._id)}
                      style={{...styles.actionBtn, ...styles.viewBtn}}
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={() => handleEditResume(resume._id)}
                      style={{...styles.actionBtn, ...styles.editBtn}}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleViewVersions(resume._id)}
                      style={{...styles.actionBtn, ...styles.versionsBtn}}
                    >
                      📚 Versions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles object for the Dashboard
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  logo: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '1rem'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  authStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#28a745'
  },
  userInfo: {
    color: '#495057',
    fontWeight: '500'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  welcomeSubtitle: {
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#6c757d',
    fontSize: '0.9rem'
  },
  quickActions: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  createBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500'
  },
  createIcon: {
    fontSize: '1.2rem'
  },
  resumeSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e9ecef'
  },
  sectionTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.5rem'
  },
  resumeCount: {
    color: '#6c757d',
    fontSize: '0.9rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  resumeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  resumeCard: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  resumeHeader: {
    marginBottom: '1rem'
  },
  resumeTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1.2rem'
  },
  resumeMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  versionBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem'
  },
  dateBadge: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem'
  },
  resumePreview: {
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#495057'
  },
  resumeActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  actionBtn: {
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  viewBtn: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  editBtn: {
    backgroundColor: '#ffc107',
    color: '#212529'
  },
  versionsBtn: {
    backgroundColor: '#17a2b8',
    color: 'white'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },
  retryBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Dashboard;
