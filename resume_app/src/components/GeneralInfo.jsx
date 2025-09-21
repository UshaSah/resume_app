import { useState } from 'react'

function GeneralInfo({formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            generalInfo: {
             ...prev.generalInfo,
            [name]: value
            }           
        }));
    };

    return (
        <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>General Information</h2>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="fullName"
                        value={formData.generalInfo.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required={true}
                    />
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.generalInfo.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required={true}
                    />
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.generalInfo.phone}
                        onChange={handleChange}
                        placeholder="123-456-7890"
                        pattern="[0-9]{10}"
                        title="Please enter a phone number in the format: 1234567890"
                        required />

                    {/* <div className="fieldset-button">
                        <button type="submit">Submit</button>
                    </div> */}
                </fieldset>

            </div>

    )

}

export default GeneralInfo