import React, { useState, useEffect } from 'react';
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'




//CSS
import './displayposts.css';

// Services
import { getProfilePost } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';


function DisplayPosts({ profileEmail }) {

    // States
    const [profilePosts, setProfilePosts] = useState([]); // 


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
                    console.log(response.data)
                    
                    setProfilePosts(response.data)
                
                }
            }

        }

        getPostToFacebook();
    }, [])



    return (
        <div className='postupload-wrapper'>
            {profilePosts && profilePosts.map((post, i) => (
                <div key={i} className='displayposts-wrapper'>
                    
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

                    <img className='displayposts-image-wrapper' src={ post.Image }></img>

                    <span className='displayposts-text-wrapper'>{ post.Text }</span>

                    <div className='displayposts-like-board-wrapper'>
                        <button className='displayposts-share'>Share</button>
                        <button className='displayposts-comment'>Comment</button>
                        <button className='displayposts-like'>Like</button>
                    </div>

                </div>                         
            ))}                      
        </div>
    );
}

export default DisplayPosts;