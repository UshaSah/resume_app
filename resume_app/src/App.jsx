import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import GeneralInfo from './components/GeneralInfo'
import EducationInfo from './components/EducationInfo'

function App() {
  const [generalInfo, setGeneralInfo] = useState({})
  const [educationInfo, setEducationInfo] = useState({})

  const handleSubmitInfo = (data) => {
    setGeneralInfo(data);
    console.log('General Info submitted:', data);
    alert('General Information saved successfully!');
    setEducationInfo(data);
    console.log('Education Info submitted:', data);
    alert('Education Information saved successfully!');
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
        <EducationInfo onSubmitEducationInfo={handleSubmitInfo} />


        {/* experience section */}
        <form>
          <div className='fieldset-wrapper'>
            <fieldset>
              <h2>Work Experience</h2>
              <label htmlFor="company">Company Name</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Your company name"
                required
              />
              <label htmlFor="position">Job Title</label>
              <input
                type="text"
                id="position"
                name="position"
                placeholder="Your job title"
                required
              />
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="e.g., 2020-2023"
                required />

            </fieldset>
          </div>
        </form>


      </div>
    </>
  )
}

export default App
