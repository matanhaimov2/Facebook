import React, { useState, useEffect } from 'react';
import workIcon from '../../Assets/Images/work-mini-icon.png'; 
import schoolIcon from '../../Assets/Images/school-mini-icon.png'; 
import birthIcon from '../../Assets/Images/birth-mini-icon.png'; 
import locationIcon from '../../Assets/Images/location-mini-icon.png'; 
import heartIcon from '../../Assets/Images/heart-mini-icon.png'; 

//CSS
import './profile.css';

// Services
import { profile } from '../../Services/profileService';



function Profile() {

    // States
    const [profileInfo, setProfileinfo] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    console.log(profileInfo)
    const [showLoading, setShowLoading] = useState(false);
    const [formattedDate, setFormattedDate] = useState(''); // Define formattedDate
    const [formattedRelation, setFormattedRelation] = useState(''); // Define formattedRelationship

    

    
    const formatDate = (inputDateStr) => { // Date formatting to a normal structure (dd/mm/yyyy)
        const inputDate = new Date(inputDateStr);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = inputDate.getFullYear();
      
        return `${day}/${month}/${year}`;
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
    
            if(response.res===true) { 
                setProfileinfo(response.data);   
                setShowDetails(true);  

                setFormattedDate(formatDate(profileInfo.birthday)); // Set the formatted date

                formatRelationship(profileInfo.relationshipstatus); // Set the formatted relationship
                
                setShowLoading(false);
            }
            else {
                console.log('Somthing went wrong')
            }
        }
    
        profilePage();
    
    }, [profileInfo.birthday])




    return (
        <div className='profile-wrapper'>
          <div className='profile-wrapper-basics'>
                <div className='sub-profile-basics'>

                </div>

                <div className='sub-profile-basics-wrapper'>
                    <div className='sub-sub-profile-basics'>

                    </div>

                    <div className='sub-sub-profile-basics'>
                        
                    </div>
                </div>

                <div className='sub-profile-basics'>
                    
                </div>
          </div>

          <div className='profile-center-wrapper'>
            
            <div className='profile-center-left-wrapper'>

            </div>

            <div className='profile-center-right-wrapper'>
                <span className='profile-center-right-inshortcut'> בקצרה </span>
                {showDetails && (
                    <div className='profile-biography-wrapper'>
                        {profileInfo.biography.length > 0 && (
                            <div>
                                {profileInfo.biography}
                            </div>
                        )}
                    </div>
                )}
                <div className='profile-details-wrapper'>
                        
                    {showDetails && (
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
    );
}

export default Profile;