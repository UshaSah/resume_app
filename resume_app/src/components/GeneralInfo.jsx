import { useState } from 'react'


function GeneralInfo({ onSubmitGeneralInfo }) {
    const [generalInfo, setGeneralInfo] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [displayedInfo, setDisplayedInfo] = useState({});

    const handleSubmitInfo = (e) => {
        e.preventDefault();
        onSubmitGeneralInfo(generalInfo);
        setIsSubmitted(true);
        console.log('General Info submitted!')

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGeneralInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmitInfo} className='fieldset-wrapper'>
            <div className='fieldset-wrapper'>
                <fieldset>
                    <h2>General Information</h2>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="fullName"
                        value={generalInfo.fullName}
                        readOnly={isSubmitted}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required={true}
                    />
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={generalInfo.email}
                        readOnly={isSubmitted}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required={true}
                    />
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={generalInfo.phone}
                        onChange={handleChange}
                        readOnly={isSubmitted}
                        placeholder="123-456-7890"
                        pattern="[0-9]{10}"
                        title="Please enter a phone number in the format: 1234567890"
                        required />

                    <div className="fieldset-button">
                        <button type="submit" disabled={isSubmitted}>Submit</button>
                        <button type="button" className="edit-button">Edit</button>
                    </div>
                </fieldset>

            </div>
        </form>

    )

}

export default GeneralInfo