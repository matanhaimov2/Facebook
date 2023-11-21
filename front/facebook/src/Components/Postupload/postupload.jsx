import React, { useState, useEffect } from 'react';
import plusIcon from '../../Assets/Images/plus-icon.png'; 
import editIcon from '../../Assets/Images/edit-icon.png'; 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { BsBoxArrowInUp } from 'react-icons/bs'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


// CSS
import './postupload.css';

// Services
import { profileImgbb, uploadPost } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Components
import DisplayPosts from '../DisplayPosts/displayposts';


function PostUpload({ profileEmail }) {

    // States
    const [profilePostTrigger, setProfilePostTrigger] = useState(false); // Trigger to pull image profile
    const [extendUploadPost, setExtendUploadPost] = useState(false);
    const [uploadImg, setUploadImg] = useState(false);
    const [uploadText, setUploadText] = useState('');
    const [uploadPrivacy, setUploadPrivacy] = useState('');
    const [showLoading, setShowLoading] = useState(false);




    const activateUploadImage = () => {
        const imageUploader = document.getElementById('imgPostUpload');

        if(imageUploader) {
            imageUploader.click()
        }
    }

    const imgUploader = async () => {

        // Get the selected image file
        const imageFile = document.getElementById('imgPostUpload')['files'][0];

        if(imageFile) {
            // Save img to display it to the user
            setUploadImg(imageFile)
        }
    }

    const uploadPostToFacebook = async () => {

        setShowLoading(true); // Show loading animation

       // Get the selected image file
        const imageFile = document.getElementById('imgPostUpload')['files'][0];


        let form = new FormData();
        form.append('image', imageFile)
        
        const responseUrlImgBB = await profileImgbb(form);

        let data = {
            "Email" : getAuthenticatedUser(), 
            "UploadedText" : uploadText,
            "UploadedImg" : responseUrlImgBB.data.display_url,
            "UploadedPrivacy" : uploadPrivacy
        }

        if(getAuthenticatedUser()) {

            const response = await uploadPost(data)
            console.log(response)

            // Set trigger
            setProfilePostTrigger(true)

            setUploadImg(false); // Deletes the image from input

            setExtendUploadPost(!extendUploadPost) // Postupload extend off

            setShowLoading(false); // Hide loading animation
        }

    }


    const extendUploader = () => {
        setExtendUploadPost(!extendUploadPost)
    }


    return (
        <div>

            {extendUploadPost ? (
                <div className='postupload-wrapper'>
                    <div className='postupload-input-wrapper'>
                        <input className='postupload-input' onChange={(e) => setUploadText(e.target.value)} placeholder=' ?מה באלך לשתף'></input>
                    </div>

                    <div className='postupload-image-wrapper'>
                            <div className='postupload-image-sub-wrapper'>
                                <input type="file" id="imgPostUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update' required/> 
                                
                                {!uploadImg ? (
                                    <button className='postupload-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={plusIcon} className="postupload-img-plusicon" /> </button>
                                ) : (
                                    <button className='postupload-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={editIcon} className="postupload-img-plusicon" /> </button>
                                )}

                                {uploadImg  && (
                                    <img src={URL.createObjectURL(uploadImg)} className='postupload-ed-image'></img>
                                )}
                            </div>
                    </div>

                    <div className='postupload-privacy-wrapper'>
                        <FormControl>
                            <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="ציבורי" name="radio-buttons-group">
                                <FormControlLabel className='postupload-privacy-button' onChange={(e) => setUploadPrivacy(e.target.value)} value="public" control={<Radio />} label="ציבורי" />
                                <FormControlLabel className='postupload-privacy-button' onChange={(e) => setUploadPrivacy(e.target.value)} value="friends" control={<Radio />} label="חברים" />
                                <FormControlLabel className='postupload-privacy-button' onChange={(e) => setUploadPrivacy(e.target.value)} value="only me" control={<Radio />} label="רק אני" />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div className='postupload-post-wrapper'>
                        {!showLoading ? (
                            <button type='submit' onClick={uploadPostToFacebook} className='login-form-button postupload-post-button'>פרסם</button>
                        ) : (
                            <Box type='submit' className='postupload-form-loading'> <CircularProgress style={{'color': 'white'}}/> </Box>
                        )}

                        <button className='postupload-arrow-button-wrapper' onClick={extendUploader}> <BsBoxArrowInUp />  </button>
                    </div>
                </div>
            ) : (
                <div className='postupload-upload-button-wrapper'>
                    {!profileEmail && (
                        <button onClick={extendUploader} className='postupload-upload-button'>העלה פוסט</button>
                    )}
                    
                    <DisplayPosts profileEmail={profileEmail} />
                </div>
            )}
        </div>
    );
}

export default PostUpload;