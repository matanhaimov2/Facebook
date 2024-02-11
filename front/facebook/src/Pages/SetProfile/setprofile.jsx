import React, { useState, useEffect, useRef } from 'react';

// Languages
import { useTranslation } from 'react-i18next';

// React Mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

//CSS
import './setprofile.css';

// Services
import { setprofile } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Images
import exitIcon from '../../Assets/Images/exit-icon.png'; 


function SetProfile({ isUpdateProfile, setIsEditProfile }) {

    // States
    const [username, setUsername] = useState('');
    const [biography, setBiography] = useState('');
    const [relationStatus, setRelationStatus] = useState('Not in a Relationship');
    const [occupation, setOccupation] = useState('');
    const [school, setSchool] = useState('');
    const [address, setAddress] = useState('');
    const [showPopup, setShowPopup] = useState(false); // Raises an error when username is taken
    const [showLoading, setShowLoading] = useState(false);

    // Translator
    const { t } = useTranslation();

    // Refs
    const setprofileRef = useRef(null);

    // Close chat box when clicking outside of the box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (setprofileRef.current && !setprofileRef.current.contains(event.target)) {
                setIsEditProfile(false)
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

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
                "Email" : getAuthenticatedUser(),
                "Biography" : biography,
                "RelationshipStatus" : relationStatus,
                "Occupation" : occupation,
                "School" : school,
                "Address" : address
            }

            if(getAuthenticatedUser()) {

                const response = await setprofile(data)

                if(response.res===true) { // If the response is true, navigate to profile

                    // Get the existing data
                    let userInfo = localStorage.getItem('UserInfo');

                    // If no existing data, create an array
                    // Otherwise, convert the localStorage string to an array
                    userInfo = userInfo ? JSON.parse(userInfo) : {};

                    // Add new data to localStorage Array
                    userInfo['username'] = response.data.username;

                    // Save back to localStorage
                    localStorage.setItem('UserInfo', JSON.stringify(userInfo));

                    window.location.href='/profile'

                }
                
                else {
                    setShowLoading(false);
                    setShowPopup(true)
                }
            }
        }
        
    }
    
    return (
        <div className={`setprofile-wrapper ${isUpdateProfile ? 'profile-update-profile-wrapper' : ''}`}>
   
            <div className='setprofile-content-wrapper' ref={setprofileRef}>

                {isUpdateProfile && ( // If true, add an exit icon
                    <button className='profile-exit-icon' onClick={() => {setIsEditProfile(false)}}> <img src={exitIcon} /> </button>
                )}
             
                <form className='setprofile-form' onSubmit={ handleSubmit }>
                        {!isUpdateProfile ? (
                            <label className='setprofile-title-button'>{t('setprofile.setprofile_more_details')}</label>
                            ) : (
                            <label className='setprofile-title-button'>{t('setprofile.setprofile_update_personal_details')}</label>
                        )}
                        
                        <div className='setprofile-username-wrapper'>
                            {!isUpdateProfile && (
                                <input type='text' className={`setprofile-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setUsername(e.target.value)} placeholder={t('setprofile.setprofile_username_placeholder')} required/>
                            )}

                            {showPopup && ( // If true, raise an error
                                <div className='setprofile-error-wrapper'>
                                    <label className='setprofile-error-title'> {t('setprofile.setprofile_error_title')} </label>
                                </div>
                            )}
                        </div>
                        <input type='text' className={`setprofile-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setBiography(e.target.value)} placeholder={t('setprofile.setprofile_biography_placeholder')}/>
                        
                        <div className='setprofile-relationship-wrapper'>
                                <label className={`setprofile-relationship-title ${document.documentElement.getAttribute('dir')==='ltr' ? 'textalign-right' : 'textalign-left'}`}>{t('setprofile.setprofile_relationship_status')}</label>
                                
                                <div className='setprofile-relationship-sub-wrapper'>
                                    <FormControl>
                                        <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue={'not-in-a-Relationship'} name="radio-buttons-group">
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setRelationStatus('Married')} value="married" control={<Radio />} label={t('setprofile.setprofile_married_status')} />
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setRelationStatus('In a Relationship')} value="in-a-relationship" control={<Radio />} label={t('setprofile.setprofile_inrelationship_status')} />
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setRelationStatus('Not in a Relationship')} value="not-in-a-Relationship" control={<Radio />} label={t('setprofile.setprofile_single_status')} />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                            </div>

                        <input type='text' className={`setprofile-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setOccupation(e.target.value)} placeholder={t('setprofile.setprofile_occupation_placeholder')}/>
                        <input type='text' className={`setprofile-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setSchool(e.target.value)} placeholder={t('setprofile.setprofile_school_placeholder')}/>
                        <input type='text' className={`setprofile-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setAddress(e.target.value)} placeholder={t('setprofile.setprofile_address_placeholder')}/>

                        {!showLoading ? (
                            <div>
                            {!isUpdateProfile ? (
                                <button type='submit' className='setprofile-form-button'>{t('setprofile.setprofile_to_your_account')}</button>
                                ) : (
                                <button id='update' type='submit' className='setprofile-form-button'>{t('setprofile.setprofile_update_details')}</button>
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