import { useState } from 'react'

function ExperienceInfo({ onSubmitExperienceInfo }) {
    const [experienceInfo, setExperienceInfo] = useState({
        company: '',
        job_title: '',
        duration: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitExperience = (e) => {
        e.preventDefault();
        onSubmitExperienceInfo(experienceInfo);
        setIsSubmitted(true);
        console.log('Experience Info submitted!');
    };

    const handleEdit = (e) => {
        setIsSubmitted(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExperienceInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmitExperience} className='fieldset-wrapper'>
            <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>Work Experience</h2>
                    <label htmlFor="company">Company Name</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={experienceInfo.company}
                        readOnly={isSubmitted}
                        onChange={handleChange}
                        placeholder="Your company name"
                        required
                    />
                    <label htmlFor="job_title">Job Title</label>
                    <input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={experienceInfo.job_title}
                        readOnly={isSubmitted}
                        onChange={handleChange}
                        placeholder="Your job title"
                        required
                    />
                    <label htmlFor="duration">Duration</label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={experienceInfo.duration}
                        readOnly={isSubmitted}
                        onChange={handleChange}
                        placeholder="e.g., 2020-2023"
                        required
                    />
                    <div className="fieldset-button">
                        <button type="submit" disabled={isSubmitted}>Submit</button>
                        <button type="button" onClick={() => setIsSubmitted(false)} className="edit-button">Edit</button>
                    </div>
                </fieldset>
            </div>
        </form>
    );
}

export default ExperienceInfo



