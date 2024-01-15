import React, { useState, useEffect } from 'react';


// SubComponents
import Post from './subComponent/post';

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


    return (
        <div className='displayposts-wrapper-wrapper'>
            {profilePosts && profilePosts.map((post, i) => (
                <Post index={i} post={post} profileEmail={profileEmail} />                    
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