import React, { useState, useEffect } from 'react';
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'


// React Icons
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";


// CSS
import './feed.css';

// Services
import { getPostsToFeed } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Components


function Feed() {

    // States
    const [profilePosts, setProfilePosts] = useState(null); // 


    useEffect(() => {
        
        const getPostToFacebook = async () => {

            let data = {
                "Email" : getAuthenticatedUser()
            }

            
            if(getAuthenticatedUser()) {

                const response = await getPostsToFeed(data)
                if(response && response.res===true) { // If the response is true, enter                    
                    setProfilePosts(response.data)

                    // Time Sort
                    response.data.sort((a, b) => {
                        return new Date(a.date) - new Date(b.date); // descending
                    })
                      
                    response.data.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date); // ascending
                    })
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
        <div className='feed-wrapper'>
            {profilePosts && profilePosts.map((post, i) => (
                <div key={i} className='feed-sub-wrapper'>
                

                    <div className='feed-datetext-wrapper'>
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
                    
                    <div className='feed-image-wrapper'>
                        <img className='feed-image' src={ post.Image }></img>
                    </div>

                    <div className='feed-like-board-wrapper'>
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

export default Feed;