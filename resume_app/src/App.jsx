import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'
import ExperienceInfo from './components/WorkInfo'
import ResumePreview from './components/ResumePreview'
import { generatePDF } from './utils/pdfGenerator'

function App() {
  const [generalInfo, setGeneralInfo] = useState({})
  const [educationInfo, setEducationInfo] = useState({})
  const [experienceInfo, setExperienceInfo] = useState({})
  const [showResume, setShowResume] = useState(false);

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

  const handleGenerateResume = () => {
    if (generalInfo.fullName && educationInfo.institution && experienceInfo.company) {
      setShowResume(true);
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
