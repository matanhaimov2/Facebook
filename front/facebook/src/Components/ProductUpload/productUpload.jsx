import React, { useState, useEffect } from 'react';

// Mui
import Select from '@mui/joy/Select';
import { Option } from '@mui/joy';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Icons
import plusIcon from '../../Assets/Images/plus-icon.png';
import editIcon from '../../Assets/Images/edit-icon.png';
import exitIcon from '../../Assets/Images/exit-icon.png';

// CSS
import './productUpload.css';

// Services
import { uploadProduct, editProduct } from '../../Services/marketplaceService';
import { profileImgbb } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';

// Cities Data
import cities_data from '../../Assets/israel_cities.json'


const ProductUpload = ({ setExtendUploadPoduct, setIsEditProduct, isUpdateProduct, updatePage, updatePageCurrentState, selectedOption }) => {

    // States
    const [uploadCategory, SetUploadCategory] = useState('');
    const [uploadText, setUploadText] = useState('');
    const [uploadImg, setUploadImg] = useState(false);
    const [uploadPrice, setUploadPrice] = useState('');

    // States - City
    const [isEditCity, setIsEditCity] = useState(false); // Open cities menu
    const [uploadCity, setUploadCity] = useState('');
    const [filteredData, setFilteredData] = useState(cities_data);

    const [showLoading, setShowLoading] = useState(false);




    const activateUploadImage = () => {
        const imageUploader = document.getElementById('imgProductUpload');

        if (imageUploader) {
            imageUploader.click()
        }
    }

    const imgUploader = async () => {

        // Get the selected image file
        const imageFile = document.getElementById('imgProductUpload')['files'][0];

        if (imageFile) {
            // Save img to display it to the user
            setUploadImg(imageFile)
        }
    }

    const uploadProductToFacebook = async (e) => {
        e.preventDefault();

        setShowLoading(true); // Show loading animation

        // Get the selected image file
        const imageFile = document.getElementById('imgProductUpload')['files'][0];


        let form = new FormData();
        form.append('image', imageFile)

        const responseUrlImgBB = await profileImgbb(form);

        let data = {
            "Email": getAuthenticatedUser(),
            "Index": selectedOption,
            "UploadedCategory": uploadCategory,
            "UploadedText": uploadText,
            "UploadedImg": responseUrlImgBB.data.display_url,
            "UploadedPrice": uploadPrice,
            "UploadedCity": uploadCity
        }

        if (getAuthenticatedUser()) {

            if (isUpdateProduct) {
                const edit_response = await editProduct(data)

                if (edit_response && edit_response.res === true) {

                    // Turn off the form
                    setIsEditProduct(false);

                    // Update data
                    updatePage(!updatePageCurrentState);

                }
            }
            else {
                const response = await uploadProduct(data)

                setExtendUploadPoduct(false);
            }


            setUploadImg(false); // Deletes the image from input

            setShowLoading(false); // Hide loading animation

        }

    }

    const closeEdit = () => {
        setIsEditProduct(false)
    }


    // Search products for a specific city from cities api

    const handleInputChange = (event) => { // when user changes input
        const { value } = event.target;
        setUploadCity(value);
        filterData(value);
        setIsEditCity(true)
    };

    const filterData = (searchTerm) => { // filtered displayed data(cities) according to searchTerm
        const filteredData = cities_data.filter((item) =>
            item.name.includes(searchTerm)
        );
        setFilteredData(filteredData);
    };

    const handleCityClick = (city_english_name) => { // when user clickes on a city to filter
        setUploadCity(capitalizeWords(city_english_name));
        setIsEditCity(false)
    }

    const capitalizeWords = (city_english_name) => { // uppercase the selected city(from 'two words' => 'Two Words')
        return city_english_name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }


    return (
        <div className='productupload-wrapper'>

            {isUpdateProduct ? (
                <button className='productupload-exit-icon' onClick={closeEdit}> <img src={exitIcon} /> </button>
            ) : (
                <button className='productupload-exit-icon' onClick={() => { setExtendUploadPoduct(false) }}> <img src={exitIcon} /> </button>
            )}

            <form className='productupload-sub-wrapper' onSubmit={uploadProductToFacebook}>
                <div>
                    <Select
                        color="primary"
                        disabled={false}
                        placeholder="בחר קטגורייה מתאימה"
                        variant="outlined"
                    >
                        <Option value="vehicles" onClick={(e) => SetUploadCategory('vehicles')}>כלי רכב</Option>
                        <Option value="electronics" onClick={(e) => SetUploadCategory('electronics')}>אלקטרוניקה</Option>
                        <Option value="instruments" onClick={(e) => SetUploadCategory('instruments')}>כלי נגינה</Option>
                        <Option value="games" onClick={(e) => SetUploadCategory('games')}>צעצועים ומשחקים</Option>

                    </Select>
                </div>

                <div>
                    <input type='text' className='productupload-input-text' onChange={(e) => setUploadText(e.target.value)} placeholder='כמה מילים על המוצר...' required />
                </div>

                <div className='productupload-image-wrapper'>
                    {isUpdateProduct ? (
                        <>
                            <span>שנה תמונה :</span>

                            <div className='productupload-image-sub-wrapper'>
                                <input type="file" id="imgProductUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update' required />


                                <button type='button' className='postupload-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={editIcon} className="postupload-img-plusicon" /> </button>


                                {uploadImg && (
                                    <img src={URL.createObjectURL(uploadImg)} className='postupload-ed-image'></img>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <span>הוסף תמונה להמחשה:</span>

                            <div className='productupload-image-sub-wrapper'>
                                <input type="file" id="imgProductUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update' required />

                                {!uploadImg ? (
                                    <button type='button' className='postupload-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={plusIcon} className="postupload-img-plusicon" /> </button>
                                ) : (
                                    <button type='button' className='postupload-upload-img-wrapper postupload-plusicon' onClick={activateUploadImage}> <img src={editIcon} className="postupload-img-plusicon" /> </button>
                                )}

                                {uploadImg && (
                                    <img src={URL.createObjectURL(uploadImg)} className='postupload-ed-image'></img>
                                )}
                            </div>
                        </>
                    )}



                </div>

                <div>
                    <input type='text' className='productupload-input-price' onChange={(e) => setUploadPrice(e.target.value)} placeholder='מחיר:' required />
                    <span> ש"ח </span>
                </div>

                <div className='productupload-cities-wrapper'>
                    <input type='text' className='productupload-input-city' value={uploadCity} onChange={handleInputChange} placeholder='עיר איסוף..' required />

                    {isEditCity && (
                        <div className='productupload-filter-cities-wrapper'>
                            {uploadCity.length >= 2 && (
                                filteredData.map((item, i) => (
                                    <div key={i} className='productupload-filter-cities'>
                                        <button className='productupload-filter-cities-button' onClick={() => handleCityClick(item.english_name)}>{item.name}</button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>

                <div className='postupload-post-wrapper'>
                    {!showLoading ? (
                        <>
                            {isUpdateProduct ? (
                                <button type='submit' className='login-form-button postupload-post-button'>שמור שינויים</button>

                            ) : (
                                <button type='submit' className='login-form-button postupload-post-button'>פרסם</button>
                            )}
                        </>
                    ) : (
                        <Box type='submit' className='postupload-form-loading'> <CircularProgress style={{ 'color': 'white' }} /> </Box>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ProductUpload;