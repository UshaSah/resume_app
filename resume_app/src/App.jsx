import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'
import ExperienceInfo from './components/WorkInfo'
import ResumePreview from './components/ResumePreview'
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
  const [generalInfo, setGeneralInfo] = useState({})
  const [educationInfo, setEducationInfo] = useState({})
  const [experienceInfo, setExperienceInfo] = useState({})
  const [showResume, setShowResume] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState(null);

  const handleSubmitInfo = (data) => {
    setGeneralInfo(data);
    console.log('General Info submitted:', data);
    alert('General Information saved successfully!');
  };


  const handleSubmitEducation = (data) => {
    setEducationInfo(data);
    console.log('Education Info submitted:', data);
    alert('Education Information saved successfully!');
  };

  const handleSubmitExperience = (data) => {
    setExperienceInfo(data);
    console.log('Experience Info submitted:', data);
    alert('Experience Information saved successfully!');
  };

  const handleGenerateResume = async () => {
    if (generalInfo.fullName && educationInfo.institution && experienceInfo.company) {
      setIsLoading(true);
      setMessage('Saving resume to backend...');
      
      try {
        const resumeData = {
          generalInfo,
          educationInfo,
          experienceInfo
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
        </header>
      </div>

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

        {/* genral info section */}
        <GeneralInfo onSubmitGeneralInfo={handleSubmitInfo} />


        {/* education section */}
        <EducationInfo onSubmitEducationInfo={handleSubmitEducation} />


        {/* experience section */}
        <ExperienceInfo onSubmitExperienceInfo={handleSubmitExperience} />

        <div className="fieldset-button">
          <resume-button onClick={handleGenerateResume}>Generate Resume</resume-button>
        </div>

        {showResume && (
          <div className="resume-container">
            <ResumePreview
              generalInfo={generalInfo}
              educationInfo={educationInfo}
              experienceInfo={experienceInfo}
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
  )
}

export default App;
