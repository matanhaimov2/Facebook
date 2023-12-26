import React, { useState, useEffect } from 'react';
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'


// React Icons
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";




//CSS
import './displayposts.css';

// Services
import { getProfilePost } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';


function DisplayPosts({ profileEmail }) {

    // States
    const [profilePosts, setProfilePosts] = useState(null); // 


    useEffect(() => {
        
        const getPostToFacebook = async () => {
            let data;
         
            if(profileEmail) {
                data = {
                    "Email" : profileEmail
                }
            }
            else {
                data = {
                    "Email" : getAuthenticatedUser()
                }
            }
            
            if(getAuthenticatedUser()) {
                const response = await getProfilePost(data)

                if(response && response.res===true) { // If the response is true, enter                    
                    setProfilePosts(response.data)

                }
                else {
                    setProfilePosts([])
                }
            }

        }

        getPostToFacebook();
    }, [])

    const likeButton = () => {
        
    }

    const commentButton = () => {
        
    }

    const shareButton = () => {
        
    }

    return (
        <div className='postupload-wrapper'>
            {profilePosts && profilePosts.map((post, i) => (
                <div key={i} className='displayposts-wrapper'>
                

                    <div className='displayposts-datetext-wrapper'>
                        <div className='displayposts-privacydate-wrapper'> 
                            {post.Privacy==='only me' && (
                                <BiSolidLock className='privacy-icon'/>
                            )}

                            {post.Privacy==='friends' && (
                                <FaUserFriends className='privacy-icon'/>
                            )}

                            {post.Privacy==='public' && (
                                <MdPublic className='privacy-icon'/>
                            )}

                            <span className='displayposts-date-wrapper'> { post.date }</span>

                        </div>

                        <span className='displayposts-text-wrapper'>{ post.Text }</span>
                        
                    </div>

                    <img className='displayposts-image-wrapper' src={ post.Image }></img>

                    <div className='displayposts-like-board-wrapper'>
                        <div className='displayposts-like-board-trio-wrapper' onClick={shareButton}>
                            <span className='displayposts-like'> <PiShareFatLight /> </span>
                            <span>Share</span>
                        </div>

                        <div className='displayposts-like-board-trio-wrapper' onClick={commentButton}>
                            <span className='displayposts-like'> <FaRegComment /> </span>
                            <span>Comment</span>
                        </div>

                        <div className='displayposts-like-board-trio-wrapper' onClick={likeButton}>
                            <span className='displayposts-like'> <SlLike /> </span>
                            <span>Like</span>
                        </div>
                    </div>

                </div>                         
            ))}      

            {profilePosts && profilePosts.length===0 && (
                <div className='displaypost-noposts'>
                    No Posts To Display
                </div>
            )}       

            {!profilePosts && (
                <div>
                    Loading
                </div>
            )}         
        </div>
    );
}

export default DisplayPosts;