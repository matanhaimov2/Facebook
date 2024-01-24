import React, { useState, useEffect } from 'react';


// React Icons 
import { IoSend } from "react-icons/io5";


//CSS
import './chats.css';

// Services


// Components



function Chats({ data }) {

    console.log(data)

    // States
    const [message, setMessage] = useState(); // content of the comment


    // Conversation Handler
    const sendMessage = async (e) => {
        e.preventDefault(); 

    }


    return (
        <div className='chats-wrapper'>
            <div className='chats-user-info'>
                <div className='chats-user-info-img-wrapper'>
                    <img className='post-userimage-wrapper' src={ data.userimages }></img>
                </div>

                <div className='chats-user-info-text-wrapper'>
                    <span className='post-top-username-wrapper'>{ data.username }</span>
                    <span>{ data.status }</span>
                </div>

            </div>

            <div className='chats-conversation-wrapper'>

            </div>

            <form onSubmit={(e) => sendMessage(e)} className='chats-message-wrapper'>
                <input type='text' className='chats-message-text' onChange={(e) => setMessage(e.target.value)} placeholder='...שלח הודעה'></input>

                <button type='submit' className='chats-message-send-button'> <IoSend /> </button>
            </form> 
        </div>
    );
}

export default Chats;