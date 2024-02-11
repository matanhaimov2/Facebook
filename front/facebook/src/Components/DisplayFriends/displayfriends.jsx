import React, { useState, useEffect, useRef } from 'react';
import { useParams  } from 'react-router-dom';


// Languages
import { useTranslation } from 'react-i18next';


// Icons
import exitIcon from '../../Assets/Images/exit-icon.png'; 


// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'


// CSS
import './displayfriends.css';

// Services
import { hasFriendsAtAll} from '../../Services/friendsService';
import { getAuthenticatedUser } from '../../Services/authService';



// Components

const DisplayFriends = ({ setIsDisplayFriends }) => {

    const { profileEmail } = useParams();

    // States
    const [friendsInfo, setFriendsInfo] = useState(); 


    // Translator
    const { t } = useTranslation();


    // Refs
    const displayfriendsRef = useRef(null);

    // Close chat box when clicking outside of the box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (displayfriendsRef.current && !displayfriendsRef.current.contains(event.target)) {
                setIsDisplayFriends(false)
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    useEffect(() => {
        const DisplayFriendsToProfile = async () => {    

            let data = {
                "Email" : getAuthenticatedUser(),
                "FriendsEmail": profileEmail,
                "Program": '1'
            }
            
            const friend_list_response = await hasFriendsAtAll(data) 

            if (friend_list_response && friend_list_response.res===true) {
                setFriendsInfo(friend_list_response.friendsData)
            }
            else {
                setFriendsInfo(friend_list_response.friendsData)
            }


        }
    
        DisplayFriendsToProfile();
    
    }, [])


    const closeDisplayFriends = () => {
        setIsDisplayFriends(false)
    }

    const navigateToProfile = (e, email) => {
        e.preventDefault(); 
        
        if (getAuthenticatedUser() === email) {
            window.location.href = '/profile';
        }
        else {
            window.location.href = '/profile/' + email;
        }
    }


    return (
        <div className='displayfriends-wrapper' ref={displayfriendsRef}>
            <button className='productupload-exit-icon' onClick={closeDisplayFriends}> <img src={exitIcon} /> </button>

            {friendsInfo ? (
                <div className='displayfriends-sub-wrapper' >
             
                  {friendsInfo && friendsInfo.map((data, i) => (
                    <div key={i} className='displayfriends-box' onClick={(e) => {navigateToProfile(e, data.email)}}>

                      <span className='topnav-search-box-title'> { data.username }</span>
                      
                      <div className='topnav-search-box-img-wrapper'>

                        {data.userimages ? (
                          <img className='topnav-search-box-img' src={ data.userimages }></img>

                        ) : (
                          <LiaUserCircleSolid className='topnav-search-box-none-img'/>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
            ) :(
                <div className='displayfriends-no-result-wrapper'>
                    <span>{t('profile.displayfriends.displayfriends_no_friends_title')}</span>
                </div>
            )} 

        </div>
    );
}

export default DisplayFriends;