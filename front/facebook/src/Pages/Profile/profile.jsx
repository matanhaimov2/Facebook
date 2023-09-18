import React, { useState, useEffect } from 'react';
import workIcon from '../../Assets/Images/work-mini-icon.png'; 
import schoolIcon from '../../Assets/Images/school-mini-icon.png'; 
import homeIcon from '../../Assets/Images/home-mini-icon.png'; 
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
    



    useEffect(() => {
        const profilePage = async () => {

            setShowLoading(true); // Show loading animation
    
    
            let data = {
                "Email" : localStorage.getItem('UserInfo')
            }
            
            const response = await profile(data)
    
            if(response.res===true) { // If the response is true, redirect to profile
                setProfileinfo(response.data);   
                setShowDetails(true);  
                
                setShowLoading(false);
            }
            else {
                console.log('Somthing went wrong')
            }
        }
    
        profilePage();
    
    }, [])




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
                <div className='profile-details-wrapper'>
                    <div className='profile-details-text'>
                        
                        {showDetails && (
                            <div>
                                {profileInfo.biography.length > 0 && (
                                    <div>
                                        {profileInfo.biography}
                                    </div>
                                )}

                                {profileInfo.occupation.length > 0 && (
                                    <div>
                                        {profileInfo.occupation}
                                    </div>
                                )}

                                {profileInfo.school.length > 0 && (
                                    <div>
                                        {profileInfo.school}
                                    </div>
                                )}

                                {profileInfo.address.length > 0 && (
                                    <div>
                                        {profileInfo.address}
                                    </div>
                                )}

                                {profileInfo.relationshipstatus.length > 0 && (
                                    <div>
                                        {profileInfo.relationshipstatus}
                                    </div>
                                )}

                                {profileInfo.birthday.length > 0 && (
                                    <div>
                                        {profileInfo.birthday}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div className='profile-details-icons'>
                        <div className=''>
                          <img className='' src={workIcon} />
                        </div>

                        <div className=''>
                          <img className='' src={schoolIcon} />
                        </div>

                        <div className=''>
                          <img className='' src={homeIcon} />
                        </div>

                        <div className=''>
                          <img className='' src={locationIcon} />
                        </div>

                        <div className=''>
                          <img className='' src={heartIcon} />
                        </div>

                    </div>

                </div>
            </div>

          </div>

        </div>
    );
}

export default Profile;