import { useState } from 'react'

function ExperienceInfo({ formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            experienceInfo: {
                ...prev.experienceInfo,
            [name]: value
            }
        }));
    };

    return (
        <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>Work Experience</h2>
                    <label htmlFor="company">Company Name</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.experienceInfo.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        required
                    />
                    <label htmlFor="job_title">Job Title</label>
                    <input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={formData.experienceInfo.job_title}
                        onChange={handleChange}
                        placeholder="Your job title"
                        required
                    />
                    <label htmlFor="duration">Duration</label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.experienceInfo.duration}
                        onChange={handleChange}
                        placeholder="e.g., 2020-2023"
                        required
                    />
                    {/* <div className="fieldset-button">
                        <button type="submit">Submit</button>
                    </div> */}
                </fieldset>
            </div>
    );
}

export default ExperienceInfo



