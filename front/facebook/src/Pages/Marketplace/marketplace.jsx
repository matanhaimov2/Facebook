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
import { getAllProduct, getSpecificProduct } from '../../Services/marketplaceService';
import { getAuthenticatedUser } from '../../Services/authService';



// Components
import ProductUpload from '../../Components/ProductUpload/productUpload';

const Marketplace = () => {

    // States
    const [marketSpecificProduct, setMarketSpecificProduct] = useState([]); // State for specific user products
    const [marketProducts, setMarketProducts] = useState([]); // State for Allproducts
    const [extendUploadProduct, setExtendUploadPoduct] = useState(false);
    const [formattedDate, setFormattedDate] = useState(''); // Define formattedDate, problem!

    // Pathnames handle
    const currentPathname = window.location.pathname;
    const isMarketplacePage = currentPathname.endsWith('/marketplace');
    const isVehiclesPage = currentPathname.endsWith('/marketplace/vehicles');
    const isElectronicsPage = currentPathname.endsWith('/marketplace/electronics');
    const isInstrumentsPage = currentPathname.endsWith('/marketplace/instruments');
    const isGamesPage = currentPathname.endsWith('/marketplace/games');
    const isMyproductsPage = currentPathname.endsWith('/marketplace/myproducts');



    const navigateToCategory = (e, title) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace/' + title;
    }

    const navigateToEveryCategory = (e) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace';
    }


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
                
                const my_response = await getSpecificProduct(data)
                if(my_response && my_response.res===true) {
                    setMarketSpecificProduct(my_response.data);
                    console.log(marketSpecificProduct);
                    console.log(my_response.data);

                }

                const response = await getAllProduct(data)
                console.log(response.data)

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
                    setMarketSpecificProduct([]);
                    setMarketProducts([]);
                }
            }

        }
    
        MarketProducts();
    
    }, [])

    const extendUploader = () => {
        setExtendUploadPoduct(!extendUploadProduct)
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

                            <div className='marketplace-category' onClick={(e) => {navigateToCategory(e, 'vehicles')}}>
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

                            <div className='marketplace-create-button-wrapper'>
                                <button className='marketplace-create-button' onClick={(e) => {navigateToCategory(e, 'myproducts')}}>המודעות שלי</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div className='marketplace-left-wrapper'>

                {/* marketplace page => contains all the products */}
                {isMarketplacePage && marketProducts && marketProducts.flat().map((productString, index) => { // flatten the array of arrays into a single array
                    const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                    return (
                        <div key={index} className='marketplace-left-products-wrapper'>
                        
                            <div className='marketplace-left-img-product-wrapper'>
                                {product.Image ? (
                                <img className='marketplace-left-img-product' src={ product.Image }></img>

                                ) : (
                                    <span>No Image</span>
                                )}
                            </div>
                        
                            <span className='marketplace-left-price-product'> { product.Price }</span>

                            <span className='marketplace-left-text-product'> { product.Text }</span>
                            
                            <div className='marketplace-left-pricedate-product-wrapper'>
                                <span className='marketplace-left-city-product'> { product.City }</span>

                                <span className='marketplace-left-date-product'> { product.date }</span>
                            </div>

                        </div>
                    );
                })}


                {/* vehicles page => contains all products in vehicles category*/}
                {isVehiclesPage && marketProducts && marketProducts.flat()
                .filter((item) => {
                    const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.
                    return product.Category === 'vehicles';
                })
                .map((productString, index) => { // flatten the array of arrays into a single array
                    const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                    return (
                        <div key={index} className='marketplace-left-products-wrapper'>

                            {product.Category==='vehicles' && (
                                <>
                                    <div className='marketplace-left-img-product-wrapper'>
                                        {product.Image ? (
                                        <img className='marketplace-left-img-product' src={ product.Image }></img>

                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                
                                    <span className='marketplace-left-price-product'> { product.Price }</span>

                                    <span className='marketplace-left-text-product'> { product.Text }</span>
                                    
                                    <div className='marketplace-left-pricedate-product-wrapper'>
                                        <span className='marketplace-left-city-product'> { product.City }</span>

                                        <span className='marketplace-left-date-product'> { product.date }</span>
                                    </div>
                                </>
                            )}

                        </div>
                        
                    );
                })}

                {/* electronics page => contains all products in electronics category*/}
                {isElectronicsPage && marketProducts && marketProducts.flat()
                .filter((item) => {
                    const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.
                    return product.Category === 'electronics';
                })
                .map((productString, index) => { // flatten the array of arrays into a single array
                    const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                    return (
                        <div key={index} className='marketplace-left-products-wrapper'>

                            {product.Category==='electronics' && (
                                <>
                                    <div className='marketplace-left-img-product-wrapper'>
                                        {product.Image ? (
                                        <img className='marketplace-left-img-product' src={ product.Image }></img>

                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                
                                    <span className='marketplace-left-price-product'> { product.Price }</span>

                                    <span className='marketplace-left-text-product'> { product.Text }</span>
                                    
                                    <div className='marketplace-left-pricedate-product-wrapper'>
                                        <span className='marketplace-left-city-product'> { product.City }</span>

                                        <span className='marketplace-left-date-product'> { product.date }</span>
                                    </div>
                                </>
                            )}

                        </div>
                        
                    );
                })}

                {/* instruments page => contains all products in instruments category*/}
                {isInstrumentsPage && marketProducts && marketProducts.flat()
                .filter((item) => {
                    const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.
                    return product.Category === 'instruments';
                })
                .map((productString, index) => { // flatten the array of arrays into a single array
                    const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                    return (
                        <div key={index} className='marketplace-left-products-wrapper'>

                            {product.Category==='instruments' && (
                                <>
                                    <div className='marketplace-left-img-product-wrapper'>
                                        {product.Image ? (
                                        <img className='marketplace-left-img-product' src={ product.Image }></img>

                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                
                                    <span className='marketplace-left-price-product'> { product.Price }</span>

                                    <span className='marketplace-left-text-product'> { product.Text }</span>
                                    
                                    <div className='marketplace-left-pricedate-product-wrapper'>
                                        <span className='marketplace-left-city-product'> { product.City }</span>

                                        <span className='marketplace-left-date-product'> { product.date }</span>
                                    </div>
                                </>
                            )}

                        </div>
                        
                    );
                })}

                {/* games page => contains all products in games category*/}
                {isGamesPage && marketProducts && marketProducts.flat()
                .filter((item) => {
                    const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.
                    return product.Category === 'games';
                })
                .map((productString, index) => { // flatten the array of arrays into a single array
                    const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                    return (
                        <div key={index} className='marketplace-left-products-wrapper'>

                            {product.Category==='games' && (
                                <>
                                    <div className='marketplace-left-img-product-wrapper'>
                                        {product.Image ? (
                                        <img className='marketplace-left-img-product' src={ product.Image }></img>

                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                                
                                    <span className='marketplace-left-price-product'> { product.Price }</span>

                                    <span className='marketplace-left-text-product'> { product.Text }</span>
                                    
                                    <div className='marketplace-left-pricedate-product-wrapper'>
                                        <span className='marketplace-left-city-product'> { product.City }</span>

                                        <span className='marketplace-left-date-product'> { product.date }</span>
                                    </div>
                                </>
                            )}

                        </div>
                        
                    );
                })}

                {/* myproducts page => contains all products the connected user uploaded*/}
                {isMyproductsPage && marketSpecificProduct && marketSpecificProduct.map((product, index) => (
                    <div key={index} className='marketplace-left-products-wrapper'>       
                        <div className='marketplace-left-img-product-wrapper'>
                            {product.Image ? (
                            <img className='marketplace-left-img-product' src={ product.Image }></img>

                            ) : (
                                <span>No Image</span>
                            )}
                        </div>
                    
                        <span className='marketplace-left-price-product'> { product.Price }</span>

                        <span className='marketplace-left-text-product'> { product.Text }</span>
                        
                        <div className='marketplace-left-pricedate-product-wrapper'>
                            <span className='marketplace-left-city-product'> { product.City }</span>

                            <span className='marketplace-left-date-product'> { product.date }</span>
                        </div>
                    </div>
                ))}
                
                
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

