import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'
import ExperienceInfo from './components/WorkInfo'

function App() {
  const [generalInfo, setGeneralInfo] = useState({})
  const [educationInfo, setEducationInfo] = useState({})
  const [experienceInfo, setExperienceInfo] = useState({})

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

      </div>
    </>
  )
}

export default App
