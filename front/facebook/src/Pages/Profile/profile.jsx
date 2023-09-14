import React, { useState, useEffect } from 'react';


//CSS
import './profile.css';

// Services
import { profile } from '../../Services/profileService';



function Profile() {

    // States
    const [profileInfo, setProfileinfo] = useState({});
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
                <div>
                    {profileInfo.username}

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
            </div>

          </div>

        </div>
    );
}

export default Profile;