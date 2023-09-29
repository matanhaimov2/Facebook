import React, { useState, useEffect } from 'react';
import workIcon from '../../Assets/Images/work-mini-icon.png'; 
import schoolIcon from '../../Assets/Images/school-mini-icon.png'; 
import birthIcon from '../../Assets/Images/birth-mini-icon.png'; 
import locationIcon from '../../Assets/Images/location-mini-icon.png'; 
import heartIcon from '../../Assets/Images/heart-mini-icon.png'; 
import editIcon from '../../Assets/Images/edit-icon.png'; 
import searchIcon from '../../Assets/Images/search-icon.png'; 
import exitIcon from '../../Assets/Images/exit-icon.png'; 


//CSS
import './profile.css';

// Services
import { profile } from '../../Services/profileService';

// Components
import SetProfile from '../SetProfile/setprofile';


function Profile() {

    // States
    const [profileInfo, setProfileinfo] = useState({});
    
    const [showLoading, setShowLoading] = useState(false);
    const [formattedDate, setFormattedDate] = useState(''); // Define formattedDate
    const [formattedRelation, setFormattedRelation] = useState(''); // Define formattedRelationship
    const [popupdateprofle, setPopUpdateProfile] = useState(false);

    

    
    const formatDate = (inputDateStr) => { // Date formatting to a normal structure (dd/mm/yyyy)
        const inputDate = new Date(inputDateStr);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = inputDate.getFullYear();
      
        setFormattedDate(`${day}/${month}/${year}`);
    }

    const formatRelationship = (inputRelationStatusEnglish) => { // Realtionship status formatting to hebrew
        if (inputRelationStatusEnglish === 'Not in a Relationship')
        {
            setFormattedRelation('רווק/ה')
        }
        else if (inputRelationStatusEnglish === 'In a Relationship')
        {
            setFormattedRelation('בזוגיות')
        }
        else if (inputRelationStatusEnglish === 'Married')
        {
            setFormattedRelation('נשוי')
        }
      
        return formattedRelation;
    }

    useEffect(() => {
        const profilePage = async () => {

            setShowLoading(true); // Show loading skeleton animation
    
    
            let data = {
                "Email" : localStorage.getItem('UserInfo')
            }
            
            const response = await profile(data)
            console.log(response)
            if(response.res===true) { 
                setProfileinfo(response.data);   
                
                formatDate(profileInfo.birthday); // Set the formatted date

                formatRelationship(profileInfo.relationshipstatus); // Set the formatted relationship
                
                setShowLoading(false);
            }
            else {
                console.log('Somthing went wrong')
            }
        }
    
        profilePage();
    
    }, [profileInfo.birthday, profileInfo.relationshipstatus])




    return (
        <div className='profile-wrapper'>
            
            <div className='profile-wrapper-basics'>

                    <div className='sub-profile-image-wrapper'>
                        <span> profile image here</span>
                    </div>

                    <div className='sub-profile-basics-wrapper'>
                        <div className='sub-sub-profile-basics'>
                        
                        {profileInfo.firstname && (
                            <div className='profile-fullname-wrapper'>
                                {profileInfo.firstname.length > 0 && (
                                    <div className='profile-fullname-text'>
                                        <span>
                                            {profileInfo.firstname}
                                        </span>
                                        <span>
                                            {profileInfo.lastname}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>

                        <div className='sub-sub-profile-basics'>
                            <span>חברים </span>
                        </div>
                    </div>

                    <div className='sub-profile-basics'>
                        <button onClick={() => {setPopUpdateProfile(true)}} className='sub-profile-edit-button'> עריכת פרופיל </button>
                    </div>
            </div>

            <div className='profile-center-wrapper'>
                
                <div className='profile-center-left-wrapper'>

                </div>

                <div className='profile-center-right-wrapper'>
                    <div className='profile-center-right-sub-wrapper'>
                        <span className='profile-center-right-inshortcut'> בקצרה </span>

                        {profileInfo.biography && (
                            <div className='profile-biography-wrapper'>
                                {profileInfo.biography.length > 0 && (
                                    <div className='profile-biography-text'>
                                        {profileInfo.biography}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className='profile-details-wrapper'>
                                
                            {profileInfo.username && (
                                <div className='profile-inner-details-wrapper'>

                                    {profileInfo.occupation.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={workIcon} />
                                            <div className='profile-details-text'>
                                                <span>עובד/ת ב- </span> {profileInfo.occupation}
                                            </div>
                                        </div>
                                        
                                    )}

                                    {profileInfo.school.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={schoolIcon} />
                                            <div className='profile-details-text'>
                                            <span>למד/ה ב-</span> {profileInfo.school}
                                            </div>
                                        </div>
                                    )}

                                    {profileInfo.address.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={locationIcon} />
                                            <div className='profile-details-text'>
                                                <span>גר/ה ב- </span>{profileInfo.address}
                                            </div>
                                        </div>
                                    )}

                                    {profileInfo.relationshipstatus.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={heartIcon} />
                                            <div className='profile-details-text'>
                                                {formattedRelation}      
                                            </div>                              
                                        </div>
                                    )}

                                    {profileInfo.birthday.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={birthIcon} />
                                            <div className='profile-details-text'>
                                                <span>נולד/ה בתאריך </span>{formattedDate} 
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )} 

                        </div>
                    </div>
                </div>

            </div>

            {/* Update Profile Form */}
            {popupdateprofle && (
                <div className='profile-update-profile-wrapper-wrapper'>
                    <SetProfile isUpdateProfile={popupdateprofle} setPopUpdateProfile={setPopUpdateProfile}/>
                </div>
            )}

        </div>
    );
}

export default Profile;