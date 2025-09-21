import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'
import ExperienceInfo from './components/WorkInfo'
import ResumePreview from './components/ResumePreview'
import ResumeSelector from './components/ResumeSelector'
import { generatePDF } from './utils/pdfGenerator'

// Simple API service
const API_BASE_URL = 'http://54.221.116.49:3000';

const saveResume = async (resumeData) => {
  const response = await fetch(`${API_BASE_URL}/api/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resumeData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save resume');
  }
  
  return response.json();
};

function App() {
  const [currentPage, setCurrentPage] = useState('selector') // 'selector', 'form', 'preview'
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [previewResume, setPreviewResume] = useState(null) // Resume data for preview page
  const [isEditingExisting, setIsEditingExisting] = useState(false)
  const [formData, setFormData] = useState({
    generalInfo: {
      fullName: '',
      email: '',
      phone: ''
    },
    educationInfo: {
      institution: '',
      degree: '',
      major: ''
    },
    experienceInfo: {
      company: '',
      job_title: '',
      duration: ''
    }
  });
  const [showResume, setShowResume] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState(null);

  
  const handleGenerateResume = async () => {
    if (formData.generalInfo.fullName && formData.educationInfo.institution && formData.experienceInfo.company) {
      setIsLoading(true);
      setMessage('Saving resume to backend...');
      
      try {
        const resumeData = {
          generalInfo: formData.generalInfo,
          educationInfo: formData.educationInfo,
          experienceInfo: formData.experienceInfo
        };
        
        const result = await saveResume(resumeData);
        setSavedResumeId(result.data.id);
        setMessage(`Resume saved successfully! ID: ${result.data.id}`);
        setShowResume(true);
      } catch (error) {
        console.error('Error saving resume:', error);
        setMessage('Error saving resume. Please try again.');
        // Still show the resume even if saving fails
        setShowResume(true);
      } finally {
        setIsLoading(false);
        setTimeout(() => setMessage(''), 5000);
      }
    } else {
      alert('Please fill in all required sections first!');
    }
  };

  const handleGeneratePDF = async () => {
    const resumeElement = document.getElementById('resume-content');
    if (resumeElement) {
      await generatePDF(resumeElement);
    } else {
      alert('Please generate a resume first to download PDF.');
    }
  };

  return (
    <>
      <div className="body">
        <header className='app-header'>
          <h1>Resume Builder</h1>
          <nav className="app-navigation">
            <button className={`nav-btn ${currentPage === 'form' ? 'active' : ''}`} onClick={() => setCurrentPage('form')}>
              Create Resume
            </button>
            <button className={`nav-btn ${currentPage === 'selector' ? 'active': ''}`} onClick={() => setCurrentPage('selector')}>
              View Resumes
            </button>
            {previewResume && (
              <button className={`nav-btn ${currentPage === 'preview' ? 'active': ''}`} onClick={() => setCurrentPage('preview')}>
                Preview
              </button>
            )}
          </nav>
        </header>
      </div>

      {currentPage === 'selector' ? (
        <ResumeSelector
          onPreviewResume={(resume) => {
            setPreviewResume(resume);
            setCurrentPage('preview');
          }}
        />
      ) : currentPage === 'preview' ? (
        <div className="preview-page">
          <div className="preview-header">
            <h1>Resume Preview</h1>
            <button onClick={() => setCurrentPage('selector')} className="back-btn">
              ← Back to Selector
            </button>
          </div>
          <ResumePreview
            generalInfo={previewResume?.generalInfo}
            educationInfo={previewResume?.educationInfo}
            experienceInfo={previewResume?.experienceInfo}
          />
        </div>
      ) : (
      <>

      {/* Message display */}
      {message && (
        <div style={{
          padding: '10px',
          margin: '10px',
          backgroundColor: '#e3f2fd',
          color: '#1565c0',
          borderRadius: '4px',
          border: '1px solid #bbdefb',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {/* form begins */}
      <div className="form-wrapper">
        <h1>Profile Information</h1>

        {/* general info section */}
        <GeneralInfo formData={formData} setFormData={setFormData} />


        {/* education section */}
        <EducationInfo formData={formData} setFormData={setFormData} />


        {/* experience section */}
        <ExperienceInfo formData={formData} setFormData={setFormData} />

        <div className="fieldset-button">
          <button className="resume-button" onClick={handleGenerateResume} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Generate Resume'}
          </button>
        </div>

        {showResume && (
          <div className="resume-container">
            <ResumePreview
              generalInfo={formData.generalInfo}
              educationInfo={formData.educationInfo}
              experienceInfo={formData.experienceInfo}
            />

            <div className="resume-actions">
              {savedResumeId && (
                <div style={{
                  padding: '10px',
                  margin: '10px 0',
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  borderRadius: '4px',
                  border: '1px solid #bbdefb'
                }}>
                  ✅ Resume saved with ID: {savedResumeId}
                </div>
              )}
              <button onClick={handleGeneratePDF}>Download PDF</button>
              <button onClick={() => window.print()}>Print Resume</button>
              <button onClick={() => setShowResume(false)}>Back to Form</button>
            </div>
          </div>
        )}


      </div>
      </>
      )}
    </>
  )
}

export default App;
