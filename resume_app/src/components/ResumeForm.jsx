import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo';
import EducationInfo from './EducationInfo';
import ExperienceInfo from './WorkInfo';
import ResumePreview from './ResumePreview';
import { generatePDF } from '../utils/pdfGenerator';

const API_BASE_URL = 'http://54.221.116.49:3000';

function ResumeForm({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    generalInfo: { fullName: '', email: '', phone: '' },
    educationInfo: { institution: '', degree: '', major: '' },
    experienceInfo: { company: '', job_title: '', duration: '' }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [versionNote, setVersionNote] = useState('');

  useEffect(() => {
    if (isEditing) {
      (async () => {
        try {
          setIsLoading(true);
          setMessage('Loading resume data...');
          const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`);
          if (!response.ok) throw new Error('Failed to fetch resume data');
          const result = await response.json();
          const resume = result.data;
          setFormData({
            generalInfo: {
              fullName: resume.generalInfo?.fullName || '',
              email: resume.generalInfo?.email || '',
              phone: resume.generalInfo?.phone || ''
            },
            educationInfo: {
              institution: resume.educationInfo?.institution || '',
              degree: resume.educationInfo?.degree || '',
              major: resume.educationInfo?.major || ''
            },
            experienceInfo: {
              company: resume.experienceInfo?.company || '',
              job_title: resume.experienceInfo?.job_title || '',
              duration: resume.experienceInfo?.duration || ''
            }
          });
          setMessage('');
        } catch (e) {
          setMessage('Error loading resume data.');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, isEditing]);

  const handleSubmitResume = async () => {
    if (!formData.generalInfo.fullName || !formData.educationInfo.institution || !formData.experienceInfo.company) {
      alert('Please fill in all required sections first!');
      return;
    }

    setIsLoading(true);
    setMessage(isEditing ? 'Updating resume...' : 'Saving resume to backend...');

    try {
      const resumeData = {
        generalInfo: formData.generalInfo,
        educationInfo: formData.educationInfo,
        experienceInfo: formData.experienceInfo,
        versionNote: isEditing ? (versionNote || 'Updated resume') : undefined,
      };

      let result;
      if (isEditing) {
        const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData),
        });
        if (!response.ok) throw new Error('Failed to update resume');
        result = await response.json();
        setMessage(`Resume updated successfully! ID: ${result.data.id}`);
      } else {
        const response = await fetch(`${API_BASE_URL}/api/resumes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumeData),
        });
        if (!response.ok) throw new Error('Failed to save resume');
        result = await response.json();
        setMessage(`Resume saved successfully! ID: ${result.data.id}`);
      }

      setSavedResumeId(result.data.id);
      setShowResume(true);

    } catch (error) {
      console.error('Error saving resume:', error);
      setMessage('Error saving resume. Please try again.');
      setShowResume(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
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
        <header className='form-header'>
          <h1>{isEditing ? 'Edit Resume' : 'Create Your Resume'}</h1>
          <button onClick={() => navigate('/')} className="back-to-selector-btn">
            ← Back to Dashboard
          </button>
        </header>
      </div>

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

      <div className="form-wrapper">
        <h1>Profile Information</h1>

        {isEditing && (
          <div style={{ width: '100%', marginBottom: '1rem' }}>
            <label htmlFor="versionNote">Version Note</label>
            <input
              id="versionNote"
              type="text"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="What changed in this version?"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        )}

        <GeneralInfo formData={formData} setFormData={setFormData} />
        <EducationInfo formData={formData} setFormData={setFormData} />
        <ExperienceInfo formData={formData} setFormData={setFormData} />

        <div className="fieldset-button">
          <button className="resume-button" onClick={handleSubmitResume} disabled={isLoading}>
            {isLoading ? 'Saving...' : (isEditing ? 'Update Resume' : 'Submit')}
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
  );
}

export default ResumeForm;
