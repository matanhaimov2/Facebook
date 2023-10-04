import React, { useState, useEffect } from 'react';
import plusIcon from '../../Assets/Images/plus-icon.png'; 
import editIcon from '../../Assets/Images/edit-icon.png'; 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { BsBoxArrowInUp } from 'react-icons/bs'

//CSS
import './postupload.css';

// Services
import { profileImgbb, uploadPost, getProfilePost} from '../../Services/profileService';



function PostUpload() {

    // States
    const [profilePost, setProfilePost] = useState(null); // 
    const [profilePostTrigger, setProfilePostTrigger] = useState(false); // Trigger to pull image profile
    const [extendUploadPost, setExtendUploadPost] = useState(false);
    const [uploadImg, setUploadImg] = useState(false);

  

    const activateUploadImage = () => {
        const imageUploader = document.getElementById('imgUpload');

        if(imageUploader) {
            imageUploader.click()
        }
    }

    const imgUploader = async () => {

        // Get the selected image file
        const imageFile = document.getElementById('imgUpload')['files'][0];

        // Save img to display it to the user
        setUploadImg(URL.createObjectURL(imageFile))

        // Create from image url
        let form = new FormData();
        form.append('image', imageFile)
        
        const response = await profileImgbb(form);

        let data = {
            "Email" : localStorage.getItem('UserInfo'), 
            "UploadedPost" : response.data.display_url
        }

        // Set trigger
        setProfilePostTrigger(true)

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
                                
                                {!uploadImg ? (
                                    <button className='profile-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={plusIcon} className="postupload-img-plusicon" /> </button>
                                ) : (
                                    <button className='profile-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={editIcon} className="postupload-img-plusicon" /> </button>
                                )}

                                {uploadImg  && (
                                    <img src={uploadImg} className='postupload-ed-image'></img>
                                )}
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