import React, { useState, useEffect } from 'react';
import plusIcon from '../../Assets/Images/plus-icon.png'; 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { BsBoxArrowInUp } from 'react-icons/bs'

//CSS
import './postupload.css';

// Services
import { profile, profileImage, uploadImage, receiveImage} from '../../Services/profileService';



function PostUpload() {

    // States
    const [imgProfile, setImgProfile] = useState(null); // 
    const [imgProfileTrigger, setImgProfileTrigger] = useState(false); // Trigger to pull image profile
    const [extendUploadPost, setExtendUploadPost] = useState(false);

    const activateUploadImage = () => {
        const imageUploader = document.getElementById('imgUpload');

        if(imageUploader) {
            imageUploader.click()
        }
    }


    const imgUploader = async () => {

        // Get the selected image file
        const imageFile = document.getElementById('imgUpload')['files'][0];


        let form = new FormData();
        form.append('image', imageFile)
        
        const response = await profileImage(form);
        console.log(response);

        let data = {
            "Email" : localStorage.getItem('UserInfo'), 
            "UploadedImage" : response.data.display_url
        }

       await uploadImage(data);

        // Set trigger
        setImgProfileTrigger(true)

    }

    const extendUploader = () => {
        setExtendUploadPost(!extendUploadPost)
    }

    return (
        <div>

            {extendUploadPost ? (
                <div className='postupload-wrapper'>
                    <div className='postupload-input-wrapper'>
                            <input className='postupload-input' placeholder=' ?מה באלך לשתף'></input>
                    </div>

                    <div className='postupload-image-wrapper'>
                            <div className='postupload-image-sub-wrapper'>
                            <input type="file" id="imgUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update'/> 
                            <button className='profile-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={plusIcon} className="postupload-img-plusicon" /> </button>
                            </div>
                    </div>

                    <div className='postupload-privacy-wrapper'>
                            <FormControl>
                                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="ציבורי" name="radio-buttons-group">
                                    <FormControlLabel className='postupload-privacy-button' value="public" control={<Radio />} label="ציבורי" />
                                    <FormControlLabel className='postupload-privacy-button' value="friends" control={<Radio />} label="חברים" />
                                    <FormControlLabel className='postupload-privacy-button' value="only me" control={<Radio />} label="רק אני" />
                                </RadioGroup>
                            </FormControl>
                    </div>

                    <div className='postupload-post-wrapper'>
                            <button type='submit' className='login-form-button postupload-post-button'>פרסם</button>
                            <button className='postupload-arrow-button-wrapper' onClick={extendUploader}> <BsBoxArrowInUp />  </button>
                    </div>
                </div>
            ) : (
                <div className='postupload-upload-button-wrapper'>
                    <button onClick={extendUploader} className='postupload-upload-button'>העלה פוסט</button>
                </div>
            )}
        </div>
    );
}

export default PostUpload;