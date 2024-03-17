import React, { useState, useEffect } from 'react';


// Languages
import { useTranslation } from 'react-i18next';


// React Mui
import { BiSolidLock } from 'react-icons/bi'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'


// Icons
import exitIcon from '../../../Assets/Images/exit-icon.png'

// React Icons
import { BiLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { LiaUserCircleSolid } from 'react-icons/lia'





// CSS
import '../subComponent/post.css'


// Services
import { commentPost, likePost } from '../../../Services/postService';
import { getAuthenticatedUser } from '../../../Services/authService';


function Post({ index, post }) {

    // States
    const [isLike, setIsLike] = useState(post.Likes ? post.Likes.includes(getAuthenticatedUser()) : false);
    const [likesLength, setLikesLength] = useState(post.Likes ? post.Likes.length : 0);

    const [isCommentClicked, setIsCommentClicked] = useState(false); // raise comment box
    const [comment, setComment] = useState(); // content of the comment
    const [allComments, setAllComments] = useState(post.Comments ? post.Comments : []);
    const [commentsLength, setCommentsLength] = useState(post.Comments ? post.Comments.length : 0);

    // Translator
    const { t } = useTranslation();


    // Like Handler
    const likeButton = async () => {

        setIsLike(!isLike);

        if (!isLike) {
            setLikesLength(likesLength + 1);
        }
        else {
            setLikesLength(likesLength - 1);
        }


        let data = {
            "ID": post.ID,
            "Email": getAuthenticatedUser(),
            "PostCreator": post.Email,
            "LikeOrDislike": !isLike
        }

        await likePost(data)

        // Like Has Been Added

    }


    // Commment Handlers
    const sendComment = async (e) => {
        e.preventDefault();

        let data = {
            "ID": post.ID,
            "Email": getAuthenticatedUser(),
            "PostCreator": post.Email,
            "Comment": comment
        }

        await commentPost(data)

        // Delete the content of the previous message
        document.getElementById('post-comment-text').value = "";


        // let allNotUpdatedComments = allComments;

        // allNotUpdatedComments.push(data);

        // setAllComments(allNotUpdatedComments);
        setAllComments([...allComments, data]);

        // setAllComments(prevComments => [...prevComments, data]);
        // console.log(allComments)

        window.location.href = '/home' // meanwhile => problem! - comments dont update when submiting a comment

    }

    const openCommentBox = () => {
        setIsCommentClicked(!isCommentClicked)
    }

    // // Sort comments by time of creation
    // useEffect(() => {

    //     allComments.sort((a, b) => {
    //         return new Date(b[2].date) - new Date(a[2].date); // ascending
    //     })

    // }, [allComments])


    // Share Handler
    const shareButton = () => {

    }


    // Profile Navigator
    const navigateToProfile = (e, email) => {
        e.preventDefault();

        window.location.href = '/profile/' + email;

    }


    return (
        <div key={index} id={post.ID ? post.ID : 'null'} className={`post-wrapper ${document.documentElement.getAttribute('dir') === 'ltr' ? 'direction-rtl' : 'direction-ltr'}`}>
            <div className='post-top-info-wrapper'>
                {post.Username && (
                    <img className='post-userimage-wrapper' src={post.UserImage} onClick={(e) => { navigateToProfile(e, post.Email) }}></img>

                )}

                <div className='post-top-text-info'>

                    <div className='post-top-username-wrapper' onClick={(e) => { navigateToProfile(e, post.Email) }}>
                        {post.Username && (
                            <span>{post.Username}</span>
                        )}
                    </div>

                    <div className='post-top-privacydate-wrapper'>
                        {post.Privacy === 'only me' && (
                            <BiSolidLock className='privacy-icon' />
                        )}

                        {post.Privacy === 'friends' && (
                            <FaUserFriends className='privacy-icon' />
                        )}

                        {post.Privacy === 'public' && (
                            <MdPublic className='privacy-icon' />
                        )}

                        <span className='post-top-date-wrapper'> {post.date.split(' ')[0]} </span>

                    </div>

                </div>

            </div>

            <span className='post-top-text-wrapper'>{post.Text}</span>

            <img className='post-top-image-wrapper' src={post.Image}></img>

            <div className='post-like-board-wrapper'>

                <div id={post.ID} className='post-like-board-trio-wrapper' onClick={(e) => { likeButton(e, index) }}>
                    {!isLike ? (
                        <>
                            <span className='post-like'> <BiLike /> </span>
                            <span>{t('home.post.post_like')}</span>
                        </>
                    ) : (
                        <>
                            <span className='post-dislike'> <BiSolidDislike /> </span>
                            <span>{t('home.post.post_dislike')}</span>
                        </>
                    )}

                    <div> {likesLength} </div>

                </div>

                <div className='post-like-board-trio-wrapper' onClick={openCommentBox}>
                    <span className='post-like'> <FaRegComment /> </span>
                    <span>{t('home.post.post_comment')}</span>
                    <span> {commentsLength} </span>
                </div>



                <div className='post-like-board-trio-wrapper' onClick={shareButton}>
                    <span className='post-like'> <PiShareFatLight /> </span>
                    <span>{t('home.post.post_share')}</span>
                </div>
            </div>

            {isCommentClicked && (
                <div className='post-comment-background'>
                    <div className='post-comment-wrapper'>
                        <button className={`post-comment-exit-icon ${document.documentElement.getAttribute('dir')==='ltr' ? 'position-right' : 'position-left'}`} onClick={openCommentBox}> <img src={exitIcon} /> </button>

                        <div className='post-all_comments-wrapper'>
                            {allComments && allComments.map((comment, i) => (
                                <div key={i} id={post.ID} className='post-all_comments-content'>

                                    {comment[4] ? (
                                        <img className='post-userimage-wrapper' src={comment[4]} onClick={(e) => { navigateToProfile(e, comment[0]) }}></img>

                                    ) : (
                                        <LiaUserCircleSolid className='post-none-userimage-wrapper' onClick={(e) => { navigateToProfile(e, comment[0]) }} />
                                    )}

                                    <div className='post-all_comments-info'>
                                        <span className='post-top-username-wrapper' onClick={(e) => { navigateToProfile(e, comment[0]) }}> {comment[3]} </span>

                                        <span className={`post-all_comments-text ${document.documentElement.getAttribute('dir')==='ltr' ? 'textalign-right' : 'textalign-left'}`}> {comment[1]} </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={(e) => sendComment(e)} className='post-comment_action-wrapper'>
                            <input type='text' id='post-comment-text' className='post-comment-placeholder' onChange={(e) => setComment(e.target.value)} placeholder={t('home.post.post_add_comment_placeholder')}></input>

                            <button type='submit' className='post-comment-submit-button'> <IoSend /> </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Post;