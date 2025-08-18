import React from 'react';
import '../styles/ResumeStyling.css';

function ResumePreview({ generalInfo, educationInfo, experienceInfo }) {
    return (
        <div className="resume-preview" id="resume-content">
            <div className="resume-header">
                <h1>{generalInfo?.fullName || 'Your Name'}</h1>
                <p>{generalInfo?.email} | {generalInfo?.phone}</p>
            </div>

            <div className="resume-section">
                <h2>Education</h2>
                <div className="education-item">
                    <h3>{educationInfo?.institution || 'University Name'}</h3>
                    <p>{educationInfo?.degree} in {educationInfo?.major}</p>
                </div>
            </div>

            <div className="resume-section">
                <h2>Work Experience</h2>
                <div className="experience-item">
                    <h3>{experienceInfo?.job_title || 'Job Title'}</h3>
                    <p>{experienceInfo?.company} | {experienceInfo?.duration}</p>
                </div>
            </div>
        </div>
    );
}

export default ResumePreview;