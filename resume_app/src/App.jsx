import { useState } from 'react'
import './App.css'
import './styles/Page.css'

function App() {
  const [count, setCount] = useState(0)

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
        <form>
          <div className='fieldset-wrapper'>
            <fieldset>
              <h2>General Information</h2>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                required={true}
              />
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email address"
                required={true}
              />
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="123-456-7890"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                title="Please enter a phone number in the format: 123-456-7890"
                required />
            </fieldset>
          </div>
        </form>


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
