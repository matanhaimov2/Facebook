import React, { useState, useEffect } from 'react';
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'


// React Icons
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";


// CSS
import '../displayposts.css';

// Services
import { likePost, displayLikes } from '../../../Services/postService';
import { getAuthenticatedUser } from '../../../Services/authService';


function Post({ index, post, profileEmail}) {

    // States
    const [likeClick, setLikeClick] = useState(); 
    const [isLike, setIsLike] = useState(post.Likes ? post.Likes.includes(getAuthenticatedUser()) : false);
    const [numberOfLikes, setNumberOfLikes] = useState(); 
    const [likesLength, setLikesLength] = useState(post.Likes ? post.Likes.length : 0);
    console.log(post)
    const likeButton = async (e, index) => {
        
        setIsLike(!isLike);

        if(!isLike) {
            setLikesLength(likesLength + 1);
        }
        else {
            setLikesLength(likesLength - 1);
        }
        

        const data = {
            "ID" : post.ID ? post.ID : null,
            "Email" : getAuthenticatedUser(),
            "PostCreator" : post.Email ? post.Email : null,
            "LikeOrDislike" : !isLike
        }

        const response = await likePost(data)

        if(response && response.res===true) {                   
            console.log('Like Has Been Added')
        }
        else {
            console.log('Something Went Wrong')
        }
    
    }

    const commentButton = () => {
        
    }

    const shareButton = () => {
        
    }

    return (
        <div key={index} id={post.ID ? post.ID : 'null'} className='displayposts-wrapper'>
        

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

                <div id={post.ID ? post.ID : 'null'} className='displayposts-like-board-trio-wrapper' onClick={(e) => {likeButton(e, index)}}>
                    {!isLike ? (
                        <>
                            <span className='displayposts-like'> <SlLike /> </span>
                            <span>Like</span>
                        </>
                    ) : (
                        <>
                            <span className='displayposts-like'> <SlLike /> </span>
                            <span>Dislike</span>
                        </>
                    )}

                    <div> { likesLength }</div>
                 
                </div>
            </div>

        </div>                         
    )    
}

export default Post;