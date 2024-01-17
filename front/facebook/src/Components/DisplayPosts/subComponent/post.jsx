import React, { useState, useEffect } from 'react';
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'


// React Icons
import { BiLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";



// CSS
import '../subComponent/post.css'


// Services
import { likePost } from '../../../Services/postService';
import { getAuthenticatedUser } from '../../../Services/authService';


function Post({ index, post }) {

    // States
    const [isLike, setIsLike] = useState(post.Likes ? post.Likes.includes(getAuthenticatedUser()) : false);
    const [likesLength, setLikesLength] = useState(post.Likes ? post.Likes.length : 0);

    const likeButton = async () => {
        
        setIsLike(!isLike);

        if(!isLike) {
            setLikesLength(likesLength + 1);
        }
        else {
            setLikesLength(likesLength - 1);
        }
        

        const data = {
            "ID" : post.ID,
            "Email" : getAuthenticatedUser(),
            "PostCreator" : post.Email,
            "LikeOrDislike" : !isLike
        }

        const response = await likePost(data)
  
        // Like Has Been Added
    
    }

    const commentButton = () => {
        
    }

    const shareButton = () => {
        
    }

    
    const navigateToProfile = (e, email) => {
        e.preventDefault(); 
        
        window.location.href = '/profile/' + email;

    }

    return (
        <div key={index} id={post.ID ? post.ID : 'null'} className='post-wrapper'>
            <div className='post-top-info-wrapper'>
                {post.Username && (
                    <img className='post-userimage-wrapper' src={ post.UserImage } onClick={(e) => {navigateToProfile(e, post.Email)}}></img>

                )}

                <div className='post-top-text-info'>

                    <div className='post-top-username-wrapper' onClick={(e) => {navigateToProfile(e, post.Email)}}>
                        {post.Username && (
                            <span>{post.Username}</span>
                        )}
                    </div>

                    <div className='post-top-privacydate-wrapper'> 
                        {post.Privacy==='only me' && (
                            <BiSolidLock className='privacy-icon'/>
                        )}

                        {post.Privacy==='friends' && (
                            <FaUserFriends className='privacy-icon'/>
                        )}

                        {post.Privacy==='public' && (
                            <MdPublic className='privacy-icon'/>
                        )}

                        <span className='post-top-date-wrapper'> { post.date.split(' ')[0]} </span>

                    </div>
                    
                </div>

            </div>

            <span className='post-top-text-wrapper'>{ post.Text }</span>



            <img className='post-top-image-wrapper' src={ post.Image }></img>

            <div className='post-like-board-wrapper'>

                <div className='post-like-board-trio-wrapper' onClick={shareButton}>
                    <span className='post-like'> <PiShareFatLight /> </span>
                    <span>Share</span>
                </div>

                <div className='post-like-board-trio-wrapper' onClick={commentButton}>
                    <span className='post-like'> <FaRegComment /> </span>
                    <span>Comment</span>
                </div>

                <div id={post.ID ? post.ID : 'null'} className='post-like-board-trio-wrapper' onClick={(e) => {likeButton(e, index)}}>
                    {!isLike ? (
                        <>
                            <span className='post-like'> <BiLike /> </span>
                            <span>Like</span>
                        </>
                    ) : (
                        <>
                            <span className='post-dislike'> <BiSolidDislike /> </span>
                            <span>Dislike</span>
                        </>
                    )}

                    <div> { likesLength } </div>
                 
                </div>
            </div>

        </div>                         
    )    
}

export default Post;