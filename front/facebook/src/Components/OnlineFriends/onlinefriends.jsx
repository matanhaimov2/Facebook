import React, { useState, useEffect } from 'react';

// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'
import { GoDotFill } from "react-icons/go";

//CSS
import './onlinefriends.css';

// Services
import { friendsStatus } from '../../Services/homeService';
import { getAuthenticatedUser } from '../../Services/authService';


// Components



function Onlinefriends() {

    // States
    const [friendsInfo, setFriendsInfo] = useState(); 


    useEffect(() => {
        const DisplayFriendsAndStatus = async () => {    

            let data = {
                "Email" : getAuthenticatedUser(),
            }
            
            const friend_list_response = await friendsStatus(data) 
            if (friend_list_response && friend_list_response.res===true) {
                setFriendsInfo(friend_list_response.Data)
            }
            else {
                setFriendsInfo([])
            }


        }
    
        DisplayFriendsAndStatus();
    
    }, [])

    return (
        <div className='onlinefriends-wrapper'>
            <div className='onlinefriends-top-wrapper'>
                <span>אנשי קשר</span>
            </div>


            <div className='displayfriends-sub-wrapper' >
            
                {friendsInfo && friendsInfo.map((data, i) => (
                <div key={i} className='onilnefriends-box'>

                    <span className='onilnefriends-text'> { data.username }</span>
                    
                    <div className='onilnefriends-img-wrapper'>

                    {data.userimages ? (
                        <img className='topnav-search-box-img' src={ data.userimages }></img>

                    ) : (
                        <LiaUserCircleSolid className='topnav-search-box-none-img'/>
                    )}

                    {data.status==='Online' ? (
                        <GoDotFill className='onlinefriends-online-status'/>
                    ) : (
                        <GoDotFill className='onlinefriends-offline-status'/>
                    )}
            
                    </div>
                </div>
                ))}

            </div>
     
            {friendsInfo && friendsInfo.length===0 && (
                <div className='onlinefriends-no-contacts-wrapper'>
                    <span>אין אנשי קשר</span>
                </div>
            )}  

            {!friendsInfo && (
                <div className='onlinefriends-no-contacts-wrapper'>
                    <span>...Loading</span>
                </div>
            )}   
        </div>
    );
}

export default Onlinefriends;