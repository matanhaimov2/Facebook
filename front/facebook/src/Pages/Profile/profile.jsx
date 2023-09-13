import React, { useState, useEffect } from 'react';


//CSS
import './profile.css';

// Services
import { profile } from '../../Services/authService';

function Profile() {

    // States
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birtday, setBirthday] = useState();
    const [address, setAddress] = useState();
    const [school, setSchool] = useState();
    const [biography, setBiography] = useState();
    const [relationStatus, setRelationStatus] = useState();
    const [username, setUsername] = useState();
    const [occupation, setOccupation] = useState();

    const [profileInfo, setProfileinfo] = useState([]);

    const [showLoading, setShowLoading] = useState(false);



    useEffect(() => {
        const profilePage = async () => {

            setShowLoading(true); // Show loading animation
    
    
            let data = {
                "Email" : localStorage.getItem('UserInfo')
            }
            
            const response = await profile(data)
    
            if(response.res===true) { // If the response is true, redirect to profile
                setProfileinfo[0] = setFirstname(response.firstname);        
                setProfileinfo[1] = setLastname(response.lastname);        
                setProfileinfo[2] = setBirthday(response.birtday);   
                setProfileinfo[3] = setAddress(response.address);        
                setProfileinfo[4] = setSchool(response.school);        
                setProfileinfo[5] = setBiography(response.biography);   
                setProfileinfo[6] = setRelationStatus(response.relationStatus);        
                setProfileinfo[7] = setUsername(response.username);
                setProfileinfo[8] = setOccupation(response.occupation);  
                
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
                    {profileInfo.map((object, i) => (
                        <span value={object} key={i}>{object}</span>
                    ))}
                </div>
            </div>

          </div>

        </div>
    );
}

export default Profile;