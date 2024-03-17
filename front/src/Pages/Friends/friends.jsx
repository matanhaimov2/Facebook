import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


// Languages
import { useTranslation } from 'react-i18next';


// React Icons
import { FaUserFriends } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";


// CSS
import './friends.css';

// Services

// Sub Components
import DisplayFriendsList from './subComponent/displayFriendsList/displayfriendslist';


const Friends = () => {

    // States
    const [isButtonMarker, setIsButtonMarker] = useState(true); 

    // Translator
    const { t } = useTranslation();

    // Params
    const { friendsTitle } = useParams();

    // Navigateor
    const navigate = useNavigate();


    // Navigate to different categories
    const navigateToCategory = (e, title) => {
        e.preventDefault(); 

        setIsButtonMarker(!isButtonMarker)
        navigate('/friends/' + title);
    }

    // Navigate to default. http://SERVER_URL/friends
    const navigateToEverythingCategory = (e) => {
        e.preventDefault(); 
        
        setIsButtonMarker(!isButtonMarker)
        navigate('/friends');
    }

    return (
        <div className='friends-wrapper'>

            <div className={`friends-center-wrapper ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`}>
                <DisplayFriendsList friendsTitle={friendsTitle} />
            </div>

            <div className={`friends-right-wrapper ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl position-right' : 'direction-ltr position-left'}`}>
                <span className='friends-right-text'> {t('friends.friends_title')} </span>

                <div className='friends-right-sub-wrapper'>

                    <div className={`marketplace-category ${isButtonMarker ? 'is-background-style' : ''}`} onClick={(e) => {navigateToEverythingCategory(e)}}>
                        <div className={`marketplace-category-round-wrapper ${isButtonMarker ? 'is-icon-style' : ''}`}>
                            <button className='marketplace-button-circle'> <FaUserFriends className='topnav-menu-icon' /> </button>
                        </div>
                        <span className='marketplace-sub-category-title'>{t('friends.friends_list_title')}</span>
                    </div>

                    <div className={`marketplace-category ${isButtonMarker ? '' : 'is-background-style'}`} onClick={(e) => {navigateToCategory(e, 'addFriends')}}>
                        <div className={`marketplace-category-round-wrapper ${isButtonMarker ? '' : 'is-icon-style'}`}>
                            <button className='marketplace-button-circle'> <MdPersonAddAlt1 className='topnav-menu-icon' /> </button>
                        </div>
                        <span className='marketplace-sub-category-title'>{t('friends.friends_add_friends_title')}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Friends;

