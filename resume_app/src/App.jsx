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

      <div className="form-wrapper">
        {/* <h1>Profile Information</h1> */}
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
      </div>
    </>
  )
}

export default App
