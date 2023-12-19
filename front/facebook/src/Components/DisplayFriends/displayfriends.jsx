import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';

// Icons
import plusIcon from '../../Assets/Images/plus-icon.png'; 
import editIcon from '../../Assets/Images/edit-icon.png'; 
import exitIcon from '../../Assets/Images/exit-icon.png'; 


// React Icons 


// CSS
import './displayfriends.css';

// Services
import { hasFriendsAtAll} from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';



// Components

const DisplayFriends = ({ setIsDisplayFriends }) => {

    const { profileEmail } = useParams();

    // States

    useEffect(() => {
        const DisplayFriendsToProfile = async () => {    

            let data = {
                "Email" : getAuthenticatedUser(),
                "FriendsEmail": profileEmail,
                "Program": '1'
            }
            
            const friend_list_response = await hasFriendsAtAll(data) 
            console.log(friend_list_response, 'now2')



        }
    
        DisplayFriendsToProfile();
    
    }, [])






    const closeDisplayFriends = () => {
        setIsDisplayFriends(false)
    }


    return (
        <div className='displayfriends-wrapper'>
            <button className='productupload-exit-icon' onClick={closeDisplayFriends}> <img src={exitIcon} /> </button>



        </div>
    );
}

export default DisplayFriends;