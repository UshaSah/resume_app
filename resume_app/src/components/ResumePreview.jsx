import React from 'react';
import './components/ResumePreview.css';

function ResumePreview({ generalInfo, educationInfo, experienceInfo }) {
    return (
        <div className="resume-preview">
            <div className="resume-header">
                <h1>{generalInfo.fullName}</h1>
                <p>{generalInfo.email} | {generalInfo.phone}</p>
            </div>

            <div className="resume-section">
                <h2>Education</h2>
                <div className="education-itme">
                    <h3>{educationInfo.institution}</h3>
                    <p>{educationInfo.degree} in {educationInfo.major}</p>
                </div>
            </div>

            <div className="resume-section">
                <h2>Work Experience</h2>
                <div className="experience-item">
                    <h3>{experienceInfo.job_title}</h3>
                    <p>{experienceInfo.company} | {experienceInfo.duration}</p>
                </div>
            </div>

        </div>
    );
}

export default ResumePreview