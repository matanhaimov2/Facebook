import React, { useState, useEffect } from 'react';


// Languages
import { useTranslation } from 'react-i18next';

// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'
import { GoDotFill } from "react-icons/go";

//CSS
import './onlinefriends.css';

// Services
import { friendsStatus } from '../../Services/friendsService';
import { getAuthenticatedUser } from '../../Services/authService';


// Components
import Chats from '../Chats/chats';



function Onlinefriends() {

    // States
    const [friendsInfo, setFriendsInfo] = useState(); 

    const [openChat, setOpenChat] = useState(false); // Opens chat box
    const [userData, setUserData] = useState(); // Contains clicked user's data
    const [prevUserData, setPrevUserData] = useState();

    // Translator
    const { t } = useTranslation();


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

    // Chat Handler
    const chatOpener = (e, data) => {
      
        if(!userData) {
            setOpenChat(true); // opens and closes chat box 
            setUserData(data);
        }
        else {
            setPrevUserData(userData);
            setUserData(data);
            setOpenChat(true); // i added only this and close chat function in chats

            if(userData===data) {
                setPrevUserData();
            }
        }
    }

    return (
        <div className='onlinefriends-wrapper'>
            <div className={`onlinefriends-top-wrapper ${document.documentElement.getAttribute('dir')==='ltr' ? 'textalign-right' : 'textalign-left'}`}>
                <span>{t('home.onlinefriends.onlinefriends_contacts_title')}</span>
            </div>


            <div className='displayfriends-sub-wrapper' >
            
                {friendsInfo && friendsInfo.map((data, i) => (
                    <div key={i} className='onilnefriends-box' onClick={(e) => {chatOpener(e, data)}}>

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
                    <span>{t('home.onlinefriends.onlinefriends_no_contacts_alert')}</span>
                </div>
            )}  

            {!friendsInfo && (
                <div className='onlinefriends-no-contacts-wrapper'>
                    <span>{t('home.onlinefriends.onlinefriends_loading_contacts_alert')}</span>
                </div>
            )}   

            {/* sends to chats component, clicked user's data */}
            {openChat && prevUserData !== userData && (
                <Chats data={userData} setOpenChat={setOpenChat} />
            )}


        </div>
    );
}

export default Onlinefriends;