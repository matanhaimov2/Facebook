import React, { useState, useEffect } from 'react';

// Icons


// React Icons 
import { AiOutlineShop } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { LiaGuitarSolid } from "react-icons/lia";
import { SlGameController } from "react-icons/sl";




// CSS
import './marketplace.css';

// Services
import { getProduct, getProductSpecific } from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService';



// Components
import ProductUpload from '../../Components/ProductUpload/productUpload';

const Marketplace = () => {

    // States
    const [marketProducts, setMarketProducts] = useState(null);
    const [extendUploadProduct, setExtendUploadPoduct] = useState(false);
    const [formattedDate, setFormattedDate] = useState(''); // Define formattedDate, problem!


    const formatDate = (inputDateStr) => { // Date formatting to a normal structure (dd/mm/yyyy)
        const inputDate = new Date(inputDateStr);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = inputDate.getFullYear();
      
        setFormattedDate(`${day}/${month}/${year}`);
    }

    useEffect(() => {

        const MarketProducts = async () => {    
    
            let data;

            data = {
                "Email" : getAuthenticatedUser()
            }


            if(getAuthenticatedUser()) {
                
                const response = await getProductSpecific(data)

                if(response && response.res===true) { 

                    setMarketProducts(response.data);

                    console.log(marketProducts);

                    // Date Format Issue:

                    // one way to solve date problem: (takes all the dates, now figure out a way to enable the function on them)
                    // const dates = response.data.map(item => (item.date));
                    // const uniqueDates = [...new Set(dates)];
                    // console.log(uniqueDates,'here')

                    // second way to solve date problem:
                    //formatDate(response.data.date); // i think that dosent work because he doesnt know how to enter a date out of 6 dates

                    // third way to solve date problem:
                    //formatDate(marketProducts.date) // its undefind                    
                     
                }
                else {
                    setMarketProducts([]);
                }
            }

        }
    
        MarketProducts();
    
    }, [])


    const extendUploader = () => {
        setExtendUploadPoduct(!extendUploadProduct)
    }

    const navigateToCategory = (e, title) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace/' + title;
    }

    const navigateToEveryCategory = (e) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace';
    }

    return (
        <div className='marketplace-wrapper'>

            <div className='marketplace-right-wrapper'>
                <div className='marketplace-right-sub-wrapper'>
                    <span className='marketplace-title'> <b> Marketplace </b> </span>

                    <div className='marketplace-search-wrapper'>
                        <input id='search-marketplace-input' className='marketplace-sub-search' placeholder="חיפוש ב-Marketplace"/>
                    </div>

                    <div className='marketplace-create-button-wrapper'>
                        <button className='marketplace-create-button' onClick={extendUploader}>+ יצירת מודעה חדשה </button>
                    </div>

                    <div className='marketplace-border-wrapper'>
                        <div className='marketplace-border'></div>
                    </div>

                    <div className='marketplace-filter-wrapper'>
                        <span className='marketplace-filter-title'> <b> מסננים</b> </span>

                        <div className='marketplace-filter-button-wrapper'>
                            <span className='marketplace-filter-title'> רמלה </span>
                            <button className='marketplace-filter-button'> ערוך </button>
                        </div>
                    </div>

                    <div className='marketplace-border-wrapper'>
                        <div className='marketplace-border'></div>
                    </div>

                    <div className='marketplace-category-wrapper'>
                        <span className='marketplace-category-title'> <b> קטגוריות </b> </span>

                        <div className='marketplace-category-sub-wrapper'>
                            <div className='marketplace-category' onClick={(e) => {navigateToEveryCategory(e)}}>
                                <div className='marketplace-category-round-wrapper'>
                                    <button className='marketplace-button-circle'> <AiOutlineShop className='topnav-menu-icon' /> </button>
                                </div>
                                <span className='marketplace-sub-category-title'> הכל</span>
                            </div>

                            <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'vehichles')}}>
                                <div className='marketplace-category-round-wrapper'>
                                    <button className='marketplace-button-circle'> <FaCar className='topnav-menu-icon' /> </button>
                                </div>
                                <span className='marketplace-sub-category-title'> כלי רכב</span>
                            </div>

                            <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'electronics')}}>
                                <div className='marketplace-category-round-wrapper'>
                                    <button className='marketplace-button-circle'> <MdOutlinePhoneAndroid  className='topnav-menu-icon' /> </button>
                                </div>
                                <span className='marketplace-sub-category-title'> אלקטרוניקה</span>
                            </div>

                            <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'instruments')}}>
                                <div className='marketplace-category-round-wrapper'>
                                    <button className='marketplace-button-circle'> <LiaGuitarSolid className='topnav-menu-icon' /> </button>
                                </div>
                                <span className='marketplace-sub-category-title'> כלי נגינה</span>
                            </div>

                            <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'games')}}>
                                <div className='marketplace-category-round-wrapper'>
                                    <button className='marketplace-button-circle'> <SlGameController className='topnav-menu-icon' /> </button>
                                </div>
                                <span className='marketplace-sub-category-title'> צעצועים ומשחקים</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className='marketplace-left-wrapper'>
                <div className='marketplace-left-products-wrapper-wrapper'>

                    {marketProducts && marketProducts.map((marketProducts, i) => (
                        <div key={i} className='marketplace-left-products-wrapper'>
                        
                            <div className='marketplace-left-img-product-wrapper'>
                                {marketProducts.Image ? (
                                <img className='marketplace-left-img-product' src={ marketProducts.Image }></img>

                                ) : (
                                    <span>nothing</span>
                                )}
                            </div>

                            <span className='marketplace-left-price-product'> { marketProducts.Price }</span>

                            <span className='marketplace-left-text-product'> { marketProducts.Text }</span>
                            
                            <div className='marketplace-left-pricedate-product-wrapper'>
                                <span className='marketplace-left-city-product'> { marketProducts.City }</span>

                                <span className='marketplace-left-date-product'> { marketProducts.date }</span>
                            </div>

                        </div>
                    ))}

                    
                </div>
                
                {extendUploadProduct && (
                    <div className='marketplace-left-productupload-wrapper'>
                        <ProductUpload setExtendUploadPoduct={setExtendUploadPoduct}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Marketplace;