import React, { useState, useEffect } from 'react';

// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'

// CSS
import './displayfriendslist.css';

// Services
import { getAuthenticatedUser } from '../../../../Services/authService';
import { hasFriendsAtAll, getAllUsersFromFriendsDB } from '../../../../Services/friendsService';

// Sub Components

function DisplayFriendsList({ friendsTitle }) {

    // States
    const[friendsList, setFriendsList] = useState()
    const[usersList, setUsersList] = useState()


    useEffect(() => {
        const getFriendsList = async () => {    

            let data = {
                "Email" : getAuthenticatedUser(),
                "FriendsEmail" : null,
                "Program" : null
            }

            if(getAuthenticatedUser()) {
                if(friendsTitle)
                {
                    const users_list_response = await getAllUsersFromFriendsDB(data) 
                    setUsersList(users_list_response.friendsData)
                }
                else 
                {
                    const friend_list_response = await hasFriendsAtAll(data) 
                    setFriendsList(friend_list_response.friendsData)
                }
            }
        }

    
        getFriendsList();
    
    }, [friendsTitle])

    const navigateToProfile = (e, email) => {
        e.preventDefault(); 
        
        window.location.href = '/profile/' + email;
    }

    return (
        
        <div className='friendslist-wrapper'>
            {friendsTitle==='addFriends' ? (
                <>
                {usersList ? (
                    <>
                    {usersList && usersList.map((data, i) => (
                        <div key={i} className='friendslist-box' onClick={(e) => {navigateToProfile(e, data.email)}}>

                            <div className='topnav-search-box-img-wrapper'>

                            {data.userimages ? (
                                <img className='friendslist-img' src={ data.userimages }></img>

                            ) : (
                                <LiaUserCircleSolid className='friendslist-none-img'/>
                            )}
                            </div>

                            <span className='friendslist-username'> { data.username }</span>
                            
                            <div className='marketplace-create-button-wrapper'>
                                <button className='marketplace-create-button' >הוספה לחברים</button>
                            </div>

                        </div>
                    ))}

                    </>
                ) : (
                    <div className='displayfriends-no-result-wrapper'>
                        <span>אין חברים להצגה</span>
                    </div>
                )} 
                </>
            ): (
                <>
                {friendsList ? (
                    <>
                    {friendsList && friendsList.map((data, i) => (
                        <div key={i} className='friendslist-box' onClick={(e) => {navigateToProfile(e, data.email)}}>

                            <div className='topnav-search-box-img-wrapper'>

                            {data.userimages ? (
                                <img className='friendslist-img' src={ data.userimages }></img>

                            ) : (
                                <LiaUserCircleSolid className='topnav-search-box-none-img'/>
                            )}
                            </div>

                            <span className='friendslist-username'> { data.username }</span>
                            
                            <div className='marketplace-create-button-wrapper'>
                                <button className='marketplace-create-button' >הוספה לחברים</button>
                            </div>

                        </div>
                    ))}

                    </>
                ) : (
                    <div className='displayfriends-no-result-wrapper'>
                        <span>אין חברים להצגה</span>
                    </div>
                )} 
                </>
            )}



        </div>
    );
}

export default DisplayFriendsList;