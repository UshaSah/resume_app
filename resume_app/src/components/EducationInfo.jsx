import { useState } from 'react'

function EducationInfo({ onSubmitEducationInfo }) {
    const [educationInfo, setEducationInfo] = useState({
        institution: '',
        degree: '',
        major: ''
    });


    const handleSubmitInfo = (e) => {
        e.preventDefault()
        onSubmitEducationInfo(educationInfo)
        console.log('Education Info submitted!')
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducationInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <form onSubmit={handleSubmitInfo} className='fieldset-wrapper'>
            <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>Education</h2>
                    <label htmlFor="name">Name of University</label>
                    <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={educationInfo.institution}
                        onChange={handleChange}
                        placeholder="Your university name"
                        required
                    />
                    <label htmlFor="degree">Degree</label>
                    <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={educationInfo.degree}
                        onChange={handleChange}
                        placeholder="Degree earned"
                        required
                    />
                    <label htmlFor="major">Field of Study</label>
                    <input
                        type="text"
                        id="major"
                        name="major"
                        value={educationInfo.major}
                        onChange={handleChange}
                        placeholder="Field of Study"
                        required />

                    <div className="fieldset-button">
                        <button type="submit">Submit</button>
                    </div>
                </fieldset>
            </div>
        </form>
    )
}

export default EducationInfo