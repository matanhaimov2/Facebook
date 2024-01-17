import React, { useState, useEffect, useRef } from 'react';

// CSS
import './feed.css';

// Services
import { getPostsToFeed } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Sub Components
import Post from '../DisplayPosts/subComponent/post';


function Feed() {

    // States
    const [profilePosts, setProfilePosts] = useState(false); 
    
    const NumberOfPostsToDisplay = 5; // Change this if you want to get more or less posts at the time
    const [postIndex, setPostIndex] = useState(1);

    useEffect(() => {
        const AddEventLisenterToScroll = (feed) => {

            const handleScroll = () => {
                console.log('Scrolling...');
                const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
                console.log('Is at bottom:', isAtBottom);
                if (isAtBottom) {
                  // Do something when the user reaches the bottom
                  console.log('User reached the bottom of the page!');
                }
              };

            window.onscroll = null;
            // Attach the event listener to the 'scroll' event
            // window.addEventListener('scroll', handleScroll);
            window.addEventListener('scroll',(event) => {
                console.log('Scrolling...');
            });

            // Clean up the event listener when the component is unmounted
            return () => {
              window.removeEventListener('scroll', handleScroll);
            };
        }
        
        const feed = document.getElementById('feed-wrapper');
     
        if(feed) {
            AddEventLisenterToScroll(feed);
        }

      }, []); // Empty dependency array ensures that the effect runs only once during mount
    

      useEffect(() => {
        const getPostToFacebook = async () => {
            let data = {
                "Email" : getAuthenticatedUser()
            }
    
            if(getAuthenticatedUser()) {
                try {
                    const response = await getPostsToFeed(data);
                    
                    if (response && response.res === true) {
                        // Fetch additional data for each post                       
                        let updatedPosts = response.data;
                        
                        updatedPosts.sort((a, b) => {
                            return new Date(b.date) - new Date(a.date); // ascending
                        })

    
                        setProfilePosts(updatedPosts);
                    }
                    else {
                        setProfilePosts([]);
                    }

                } catch (error) {
                    console.error('An error occurred while fetching posts:', error);
                    setProfilePosts([]);
                }
            }
        };
    
        getPostToFacebook();
    }, []);

    return (
        <div id='feed-wrapper' className='feed-wrapper'>
            {profilePosts && profilePosts.map((post, i) => (
                <Post key={i} index={i} post={post} />                         
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