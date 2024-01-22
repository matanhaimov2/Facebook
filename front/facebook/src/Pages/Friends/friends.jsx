import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


// React Icons
import { FaUserFriends } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";


// CSS
import './friends.css';

// Services

// Sub Components
import DisplayFriendsList from './subComponent/displayFriendsList/displayfriendslist';






const Friends = () => {

    // Params
    const { friendsTitle } = useParams();

    
    // States
    const [isButtonMarker, setIsButtonMarker] = useState(false); 


    // Navigateor
    const navigate = useNavigate();


    // Navigate to different categories
    const navigateToCategory = (e, title) => {
        e.preventDefault(); 

        navigate('/friends/' + title);
    }

    // Navigate to default. http://SERVER_URL/friends
    const navigateToEverythingCategory = (e) => {
        e.preventDefault(); 
        
        navigate('/friends');
    }

    return (
        <div className='friends-wrapper'>

            <div className='friends-center-wrapper'>
                <DisplayFriendsList friendsTitle={friendsTitle} />
            </div>

            <div className='friends-right-wrapper'>
                <span className='friends-right-text'> חברים </span>

                <div className='friends-right-sub-wrapper'>

                    <div className='marketplace-category' onClick={(e) => {navigateToEverythingCategory(e)}}>
                        <div className='marketplace-category-round-wrapper' >
                            <button className='marketplace-button-circle'> <FaUserFriends className='topnav-menu-icon' /> </button>
                        </div>
                        <span className='marketplace-sub-category-title'> רשימת חברים</span>
                    </div>

                    <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'addFriends')}}>
                        <div className='marketplace-category-round-wrapper'>
                            <button className='marketplace-button-circle'> <MdPersonAddAlt1 className='topnav-menu-icon' /> </button>
                        </div>
                        <span className='marketplace-sub-category-title'> הוסף חבר חדש</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Friends;

