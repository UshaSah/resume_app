import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'
import ExperienceInfo from './components/WorkInfo'
// import ResumePreview from './components/ResumePreview'

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
    alert('Experience Infomation successfully saved!')
  }

  const handleGenerateResume = () => {
    if (generalInfo.fullName && educationInfo.institution && experienceInfo.company) {
      setShowResume(true);
    } else {
      alert('Please fill in all required section first!')
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
          <resume-button type="submit">Generate Resume</resume-button>
        </div>
      </div>
    </>
  )
}

export default App
