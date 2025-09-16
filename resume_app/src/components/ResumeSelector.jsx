
import { useState, useEffect } from 'react';
import './ResumeSelector.css';

// API configuration
const API_BASE_URL = 'http://54.221.116.49:3000'

// conditional rendering
const ResumeSelector = () => {
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    // function to fetch all resumes from the API
    const fetchResumes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/api/resumes`);

            if (!response.ok) {
                throw new Error('Failed to fetch resumes');
            }

            const data = await response.json();
            setResumes(data.data || []);

        } catch (error) {
            setError(error.message);
            console.error('Error fetching resumes: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeSelect = (resumeId) => {
        if (resumeId === '') {
            setSelectedResume(null);
            return;
        }

        const resume = resumes.find(r => r._id === resumeId);
        setSelectedResume(resume);
    };

    // function to format resume display name for dropdown
    const getResumeDisplayName = (resume) => {
        const name = resume.generalInfo?.name || 'Unknown';
        const company = resume.experienceInfo?.company || 'No Company';
        const date = new Date(resume.createdAt).toLocaleDateString();
        return `${name} - ${company} (${date})`;
    }

    // loading state - show spinner while fetching data
    if (loading) {
        return (
            <div className="resume-selector">
                <div className='loading'>
                    <h2>Loading Resumes...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }

// error state
if (error) return <div className="resume-selector">Error: {error}</div>;

return (
    <div className="resume-selector">
      <div className="selector-section">
        <label htmlFor="resume-dropdown">Select a Resume:</label>
        <select
          id="resume-dropdown"
          className="resume-dropdown"
          value={selectedResume?._id || ''}
          onChange={(e) => {
            const resume = resumes.find(r => r._id === e.target.value);
            setSelectedResume(resume || null);
          }}
        >
          <option value="">-- Choose a Resume --</option>
          {resumes.map((r) => (
            <option key={r._id} value={r._id}>
              {getResumeDisplayName(r)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
  export default ResumeSelector;
// event handling

