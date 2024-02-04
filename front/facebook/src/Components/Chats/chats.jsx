import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";


// Languages
import { useTranslation } from 'react-i18next';


// React Icons 
import { IoSend } from "react-icons/io5";

// Icons
import exitIcon from '../../Assets/Images/exit-icon.png'


// Global Veribales
import { SERVER_URL } from "../../Assets/GlobalVeriables";

// CSS
import './chats.css';

// Services


// Components



function Chats({ data, setOpenChat }) {

    // States
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState(); // content of the comment
    const [allMessages, setAllMessages] = useState([]);
    const [chat, setChat] = useState([]);

    
    // Translator
    const { t } = useTranslation();

    // Refs
    const chatRef = useRef(null);

    // Close chat box when clicking outside of the box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setOpenChat(false)
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    const socket = io.connect(SERVER_URL);

    //  Means an other chat is online delete the last chat info
    useEffect(() => {
        console.log('whatttttttttttttttttt')
        // Reset all the parameters
        setMessage()
        setAllMessages([])
        setChat([])
        setConnected(false)

    }, [data])

    // Connect to the right chat room
    useEffect(() => {

        const connect = async () => {

            const sender = JSON.parse(localStorage.getItem("UserInfo")).username;
            const to = data.username;

            // Concatenate usernames in alphabetical order
            const roomName = [sender, to].sort().join('_');

            const payload = {
                "roomName": roomName
            }

            socket.emit('join', payload);

            setConnected(true);
        }

        connect();

    }, [connected])

    // Get all messages only after connect
    useEffect(() => {

        const getMessages = async () => {

            socket.on("message", msg => {
                setAllMessages([...allMessages, msg]);
            });

        }

        if (connected) {
            getMessages();
        }

        // return () => {
        //     // Cleanup the event handler when the component unmounts
        //     socket.disconnect();
        // };

    }, [allMessages.length, connected])

    useEffect(() => {
        if (allMessages.length > 0) {
            let curChat = chat;

            curChat.push(allMessages[0]);

            console.log(curChat)

            setChat(curChat);
        }
    }, [allMessages])



    // Conversation Handler
    const sendMessage = async (e) => {
        e.preventDefault();

        if (message.length > 0) {

            const sender = JSON.parse(localStorage.getItem("UserInfo")).username;
            const to = data.username;

            // Concatenate usernames in alphabetical order
            const roomName = [sender, to].sort().join('_');

            const payload = {
                "sender": sender,
                "to": to,
                "message": message,
                "roomName": roomName
            }

            socket.emit("message", payload);

            // Reset message
            setMessage("");

            // Delete the content of the previous message
            document.getElementById('chats-text-box').value = "";
        }
    }

    // Chat Handler
    const chatOpener = (e, condition) => {
        setOpenChat(condition)
    }

    // useEffect(() => {
    //     console.log(allMessages, 'here4e');
    //     console.log(chat, 'hereas');


    // }, [allMessages])

    return (
        <div className='chats-background' ref={chatRef}>
            <div className='chats-wrapper'>
                <button className='chats-exit-icon' onClick={(e) => { chatOpener(false) }}> <img src={exitIcon} /> </button>

                <div className='chats-user-info'>

                    <div className='chats-user-info-img-wrapper'>
                        <img className='post-userimage-wrapper' src={data.userimages}></img>
                    </div>

                    <div className='chats-user-info-text-wrapper'>
                        <span className='post-top-username-wrapper'>{data.username}</span>
                        <span>{data.status}</span>
                    </div>

                </div>

                <div className='chats-conversation-wrapper'>

                    {chat.map((message, i) => (
                        <div key={message.message} className='chats-conversation-message-wrapper'>

                            <div className='chats-conversation-message-sender'>
                                <div className='chats-user-info-img-wrapper'>
                                    <img className='post-userimage-wrapper' src={data.userimages}></img>
                                </div>
                            </div>

                            <div className='chats-conversation-message'>
                                {message.message}
                            </div>
                        </div>
                    ))}

                </div>

                <form onSubmit={(e) => sendMessage(e)} className={`chats-message-wrapper ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`}>
                    <input id='chats-text-box' type='text' className={`chats-message-text ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`}  onChange={(e) => setMessage(e.target.value)} placeholder={t('chats.chats_send_message_placeholder')}></input>

                    <button type='submit' className='chats-message-send-button'> <IoSend /> </button>
                </form>
            </div>
        </div>
    );
}

export default Chats;