import { useState } from 'react'
import './App.css'
import './styles/Page.css'
import './components/GeneralInfo'
import GeneralInfo from './components/GeneralInfo'

function App() {
  const [generlInfo, setGeneralInfo] = useState('')

  const handleSubmitInfo = (data) => {
    console.log('General Info submitted:', data);
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
        <GeneralInfo onSumitGeneralInfo={handleSubmitInfo} />


        {/* education section */}
        <form>
          <div className='fieldset-wrapper'>
            <fieldset>
              <h2>Education</h2>
              <label htmlFor="name">Name of University</label>
              <input
                type="text"
                id="institution"
                name="Name of University"
                placeholder="Your university name"
                required={true}
              />
              <label htmlFor="degree">Degree</label>
              <input
                type="text"
                id="degree"
                name="degree"
                placeholder="Degree earned"
                required={true}
              />
              <label htmlFor="major">Field of Education</label>
              <input
                type="text"
                id="major"
                name="major"
                placeholder="Field of Education"
                required />

            </fieldset>
          </div>
        </form>

        {/* experience section */}
        <form>
          <div className='fieldset-wrapper'>
            <fieldset>
              <h2>Education</h2>
              <label htmlFor="name">Name of University</label>
              <input
                type="text"
                id="institution"
                name="Name of University"
                placeholder="Your university name"
                required={true}
              />
              <label htmlFor="degree">Degree</label>
              <input
                type="text"
                id="degree"
                name="degree"
                placeholder="Degree earned"
                required={true}
              />
              <label htmlFor="major">Field of Education</label>
              <input
                type="text"
                id="major"
                name="major"
                placeholder="Field of Education"
                required />

            </fieldset>
          </div>
        </form>


      </div>
    </>
  )
}

export default App
