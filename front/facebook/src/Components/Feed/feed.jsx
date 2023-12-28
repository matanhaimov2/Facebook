import React, { useState, useEffect } from 'react';


// CSS
import './feed.css';

// Services
import { profileImgbb, uploadPost } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Components
import DisplayPosts from '../DisplayPosts/displayposts';



function Feed() {

    // States



    return (
        <div className='feed-wrapper'>
            <DisplayPosts />
        </div>
    );
}

export default Feed;