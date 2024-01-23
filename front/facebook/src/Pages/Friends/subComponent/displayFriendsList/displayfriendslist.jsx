import React, { useState, useEffect } from 'react';

// CSS
import './displayfriendslist.css';

// Services
import { getAuthenticatedUser } from '../../../../Services/authService';
import { hasFriendsAtAll, getAllUsersFromFriendsDB } from '../../../../Services/friendsService';

// Sub Components
import FriendListItem from './FriendListItem/friendlistitem';

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


    return (
        
        <div className='friendslist-wrapper'>
            {friendsTitle==='addFriends' ? (
                <>
                {usersList ? (
                    <>
                    {usersList && usersList.map((data, i) => (
                        
                        <FriendListItem key={i} index={i} data={data} isUserList={true}/>

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
                        
                        <FriendListItem key={i} index={i} data={data} isUserList={false}/>

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