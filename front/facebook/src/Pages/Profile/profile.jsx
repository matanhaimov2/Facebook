import React, { useState, useEffect } from 'react';


//CSS
import './profile.css';

// Services
import { profile } from '../../Services/authService';



function Profile() {

    // States
    const [profileInfo, setProfileinfo] = useState({});

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
                    {profileInfo.firstname}
                    {profileInfo.lastname}

                    {profileInfo.biography.length > 0 && (
                        <div>
                            {profileInfo.biography}
                        </div>
                    )}

                </div>
            </div>

          </div>

        </div>
    );
}

export default Profile;