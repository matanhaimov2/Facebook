import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

//CSS
import './setprofile.css';

// Services
import { setprofile } from '../../Services/profileService';

// Images
import exitIcon from '../../Assets/Images/exit-icon.png'; 


function SetProfile({ isUpdateProfile, setIsEditProfile }) {

    // States
    const [username, setUsername] = useState('');
    const [biography, setBiography] = useState('');
    const [relationStatus, setRelationStatus] = useState('');
    const [occupation, setOccupation] = useState('');
    const [school, setSchool] = useState('');
    const [address, setAddress] = useState('');
    const [showPopup, setShowPopup] = useState(false); // Raises an error when username is taken
    const [showLoading, setShowLoading] = useState(false);
    // useEffect(() => {
        
    // }, []) its for when you want to start the forbidden setprofile route

    const handleSubmit = async (e) => {
        e.preventDefault();

        setShowLoading(true); // Show loading animation

        setShowPopup(false)

        if(!biography && !relationStatus && !occupation && !school && !address) {
            setIsEditProfile(false);
        }

        else {
            let data = {
                "Username" : username,
                "Email" : localStorage.getItem('UserInfo'),
                "Biography" : biography,
                "RelationshipStatus" : relationStatus,
                "Occupation" : occupation,
                "School" : school,
                "Address" : address
            }
            console.log(data)
            const response = await setprofile(data)
    
            if(response.res===true) { // If the response is true, navigate to profile
                window.location.href='/profile'
            }
            else {
                setShowLoading(false);
                setShowPopup(true)
            }
        }
        
    }



    
    return (
        <div className={`setprofile-wrapper ${isUpdateProfile ? 'profile-update-profile-wrapper' : ''}`}>
   
            <div className='setprofile-content-wrapper'>

                {isUpdateProfile && ( // If true, add an exit icon
                    <button className='profile-exit-icon' onClick={() => {setIsEditProfile(false)}}> <img src={exitIcon} /> </button>
                )}
             
                <form className='setprofile-form' onSubmit={ handleSubmit }>
                        {!isUpdateProfile ? (
                            <label className='setprofile-title-button'> פרטים נוספים</label>
                            ) : (
                            <label className='setprofile-title-button'>עדכון פרטים אישיים</label>
                        )}
                        
                        <div className='setprofile-username-wrapper'>
                            {!isUpdateProfile && (
                                <input type='text' className='setprofile-input' onChange={(e) => setUsername(e.target.value)} placeholder='שם המשתמש שלך (חובה)' required/>
                            )}

                            {showPopup && ( // If true, raise an error
                                <div className='setprofile-error-wrapper'>
                                    <label className='setprofile-error-title'> Username is already taken </label>
                                </div>
                            )}
                        </div>
                        <input type='text' className='setprofile-input' onChange={(e) => setBiography(e.target.value)} placeholder='ביוגרפיה (לא חובה)'/>
                        
                        <div className='setprofile-relationship-wrapper'>
                                <label className='setprofile-relationship-title'>מצב יחסים</label>
                                
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

                        {!showLoading ? (
                            <div>
                            {!isUpdateProfile ? (
                                <button type='submit' className='setprofile-form-button'>למעבר לחשבון שלך</button>
                                ) : (
                                <button id='update' type='submit' className='setprofile-form-button'>עדכון פרטים</button>
                            )}
                            </div>
                            ) : (
                            <Box type='submit' className='login-form-loading'> <CircularProgress style={{'color': 'white'}}/> </Box>
                        )}
                        
                </form>
            </div>
        </div>
    );
}

export default SetProfile;