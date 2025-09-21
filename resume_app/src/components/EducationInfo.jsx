import { useState } from 'react'

function EducationInfo({ formData, setFormData }) { 
    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            educationInfo: {
             ...prev.educationInfo,
            [name]: value
            }
        }));
    };
    return (
        <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>Education</h2>
                    <label htmlFor="name">Name of University</label>
                    <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.educationInfo.institution}
                        onChange={handleEducationChange}
                        placeholder="Your university name"
                        required
                    />
                    <label htmlFor="degree">Degree</label>
                    <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={formData.educationInfo.degree}
                        onChange={handleEducationChange}
                        placeholder="Degree earned"
                        required
                    />
                    <label htmlFor="major">Field of Study</label>
                    <input
                        type="text"
                        id="major"
                        name="major"
                        value={formData.educationInfo.major}
                        onChange={handleEducationChange}
                        placeholder="Field of Study"
                        required />

                    {/* <div className="fieldset-button">
                        <button type="submit">Submit</button>
                    </div> */}
                </fieldset>
            </div>
    )
}

export default EducationInfo