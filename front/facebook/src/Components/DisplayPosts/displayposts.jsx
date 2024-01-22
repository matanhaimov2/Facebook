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


    return (
        <div className='displayposts-wrapper-wrapper'>
            {!profileEmail ? (
                <>
                    {/* display without filtering logged in user, posts */}
                    {profilePosts && profilePosts.map((post, i) => (
                        <Post key={i} index={i} post={post} />                    
                    ))}  
                </>
            ):(
                <>
                    {/* display only filtered privacy when visiting another profile*/}
                    {profilePosts && profilePosts
                    .filter(post => post.Privacy === "public" || post.Privacy === "friends")
                    .map((post, i) => (
                        <Post key={i} index={i} post={post} />
                    ))}
                </>
            )}

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