import React, { useState } from 'react';
import axios from 'axios';


//CSS
import './setprofile.css';

// Services
import { register } from '../../Services/authService';


function SetProfile() {

    // States
    const [username, setUsername] = useState();
    const [biography, setBiography] = useState('');
    const [relationStatus, setRelationStatus] = useState('');
    const [occupation, setOccupation] = useState('');
    const [school, setSchool] = useState('');
    const [address, setAddress] = useState('');
    const [showPopup, setShowPopup] = useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setShowPopup(false)

        let data = {
            "Username" : username,
            "Biography" : biography,
            "RelationshipStatus" : relationStatus,
            "Occupation" : occupation,
            "School" : school,
            "Address" : address
        }

        const response = await register(data)

        if(response.data.res===true) { // If the response is true, redirect to profile
            window.location.href='/profile'
        }
        else {
            setShowPopup(true)
        }
    }




    
    return (
        <div className='setprofile-wrapper'>
            <div className='setprofile-content-wrapper'>
            <form className='setprofile-form' onSubmit={ handleSubmit }>
                        <label className='setprofile-title-button'> פרטים נוספים</label>
                        <div className='setprofile-username-wrapper'>
                            <input type='text' className='setprofile-input' onChange={(e) => setUsername(e.target.value)} placeholder='שם המשתמש שלך (חובה)' required/>

                            {showPopup && (
                            <div className='setprofile-error-wrapper'>
                                <label className='setprofile-error-title'> Username is already taken </label>
                            </div>
                            )}
                        </div>
                        <input type='text' className='setprofile-input' onChange={(e) => setBiography(e.target.value)} placeholder='ביוגרפיה (לא חובה)'/>
                        
                        <div className='setprofile-relationship-wrapper'>
                                <label className='setprofile-relationship-title'>מצב יחסים (לא חובה)</label>
                                
                                <div className='setprofile-relationship-sub-wrapper'>
                                    <div className='register-gender'>
                                        <label className='register-gender-title'>רווק/ה</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setRelationStatus('Not in a Relationship')}/>
                                    </div>

                                    <div className='register-gender'>
                                        <label className='register-gender-title'>בזוגיות</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setRelationStatus('In a Relationship')}/>
                                    </div>
                                    
                                    <div className='register-gender'>
                                        <label className='register-gender-title'>נשוי</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setRelationStatus('Married')}/>
                                    </div>
                                </div>
                            </div>

                        <input type='text' className='setprofile-input' onChange={(e) => setOccupation(e.target.value)} placeholder='תעסוקה (לא חובה)'/>
                        <input type='text' className='setprofile-input' onChange={(e) => setSchool(e.target.value)} placeholder='בית הספר שבו למדת (לא חובה)'/>
                        <input type='text' className='setprofile-input' onChange={(e) => setAddress(e.target.value)} placeholder='כתובת (לא חובה)'/>


                        <button type='submit' className='setprofile-form-button'>למעבר לחשבון שלך</button>
                    </form>
            </div>
        </div>
    );
}

export default SetProfile;