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
import { likePost, displayUsernameAndImage } from '../../../Services/postService';
import { getAuthenticatedUser } from '../../../Services/authService';


function Post({ index, post }) {

    // States
    const [isLike, setIsLike] = useState(post.Likes ? post.Likes.includes(getAuthenticatedUser()) : false);
    const [likesLength, setLikesLength] = useState(post.Likes ? post.Likes.length : 0);

    // useEffect(() => {
        
    //     const getUsernameAndImage = async () => {
    //         let data = {
    //             "PostCreator" : post.Email
    //         }

    //         const additionalDataResponse = await displayUsernameAndImage(data)

    //         if(additionalDataResponse && additionalDataResponse.res===true) {                   
    //             post.UserImage = additionalDataResponse.data.Userimage;
    //             post.Username = additionalDataResponse.data.Username;    

    //             console.log(post)

    //         }
    //         else {
    //             console.log('Something Went Wrong')
    //         }
    //     }

    //     getUsernameAndImage();
    // }, [])




    const likeButton = async (e, index) => {
        
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
            {post.Username && (
                <div className='displayposts-user-info-wrapper'>
                    <span>{post.Username}</span>
                    <img className='displayposts-userimage-wrapper' src={ post.UserImage }></img>
                </div>
            )}

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

                    <div> { likesLength } </div>
                 
                </div>
            </div>

        </div>                         
    )    
}

export default Post;