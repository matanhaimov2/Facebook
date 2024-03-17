import React, { useState } from 'react';


// Languages
import { useTranslation } from 'react-i18next';


// CSS
import '../displayfriendslist.css';

// Icons
import noneImg from '../../../../../Assets/Images/noneimg.jpg'; 

// Services
import { startFriendRequest, getPendingFriend } from '../../../../../Services/friendsService'
import { getAuthenticatedUser } from '../../../../../Services/authService'



function FriendListItem({ index, data, isUserList}) {

    // States
    const [friendPending, setFriendPending] = useState(false); // Pending problem !!! - after refreshing page, pending gets delete.

    
    // Translator
    const { t } = useTranslation();


    const friendRequest = async (e, friendEmail) => {
        let data = {
            "Email" : getAuthenticatedUser(), 
            "FriendEmail": friendEmail
        }

        const response = await startFriendRequest(data);
        if (response && response.res===true) {
            setFriendPending(true)
        }

    }


    const navigateToProfile = (e, email) => {
        e.preventDefault(); 
        
        window.location.href = '/profile/' + email;
    }


    return (
        <div key={index} className='friendslist-box'>

            <div className='topnav-search-box-img-wrapper' onClick={(e) => {navigateToProfile(e, data.email)}}>

            {data.userimages ? (
                <img className='friendslist-img' src={ data.userimages }></img>

            ) : (
                <img className='friendslist-none-img ' src={ noneImg }></img>
            )}
            </div>

            <span className='friendslist-username'> { data.username }</span>
            
            <div className='friendlist-create-button-wrapper'>
                {isUserList && (
                    <>
                        {!friendPending ? (
                            <button onClick={(e) => {friendRequest(e, data.email)}} className='marketplace-create-button' >{t('friends.friends_add_friend_button')}</button>

                        ) : (
                            <button className='marketplace-create-button'>{t('friends.friends_pending_alert')}</button>
                        )}
                    </>

                )}
            </div>
            
        </div>
    );

}

export default FriendListItem;