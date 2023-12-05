import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { RxExit } from "react-icons/rx";

// Icons


// React Icons 
import { AiOutlineShop } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { LiaGuitarSolid } from "react-icons/lia";
import { SlGameController } from "react-icons/sl";
import { SlOptionsVertical } from "react-icons/sl";
import { AiOutlineEdit } from "react-icons/ai";


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
    const [isOption, setIsOption] = useState(false); // state for options on a product
    const [isOptionExit, setIsOptionExit] = useState(false); // state for options on a product


    // Pathnames handle
    const currentPathname = window.location.pathname;
    const isMarketplacePage = currentPathname.endsWith('/marketplace');
    const isVehiclesPage = currentPathname.endsWith('/marketplace/vehicles');
    const isElectronicsPage = currentPathname.endsWith('/marketplace/electronics');
    const isInstrumentsPage = currentPathname.endsWith('/marketplace/instruments');
    const isGamesPage = currentPathname.endsWith('/marketplace/games');
    const isMyproductsPage = currentPathname.endsWith('/marketplace/myproducts');


    // Navigate to different categories (vehicles, instruments, games, etc...)
    const navigateToCategory = (e, title) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace/' + title;
    }

    // Navigate to allproducts from all users category. http://SERVER_URL/marketplace
    const navigateToEverythingCategory = (e) => {
        e.preventDefault(); 
        
        window.location.href = '/marketplace';
    }


    useEffect(() => {

        const MarketProducts = async () => {    
    
            let data;

            data = {
                "Email" : getAuthenticatedUser()
            }


            if(getAuthenticatedUser()) {
                
                const all_response = await getSpecificProduct(data) // Gets all products from the specific user signed in
                if(all_response && all_response.res===true) {
                    setMarketSpecificProduct(all_response.data);
                    console.log(marketSpecificProduct); 
                }

                const response = await getAllProduct(data) // Gets all products from all users
                if(response && response.res===true) { 
                    setMarketProducts(response.data);
                    console.log(marketProducts);        
                     
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

    const openOptions = () => {
        setIsOption(!isOption)
        setIsOptionExit(!isOptionExit)
    }

    // Formats date from month/day/year to day/month/year
    const ILdate = { day: 'numeric', month: 'numeric', year: 'numeric' };

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
                            <div className='marketplace-category' onClick={(e) => {navigateToEverythingCategory(e)}}>
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
                            
                            <div className='marketplace-left-contents'>
                                <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                                <span className='marketplace-left-text-product'> { product.Text }</span>
                                
                                <div className='marketplace-left-pricedate-product-wrapper'>
                                    <span className='marketplace-left-city-product'> { product.City }</span>

                                    <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                                </div>
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
                                    
                                    <div className='marketplace-left-contents'>
                                        <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                                        <span className='marketplace-left-text-product'> { product.Text }</span>
                                        
                                        <div className='marketplace-left-pricedate-product-wrapper'>
                                            <span className='marketplace-left-city-product'> { product.City }</span>

                                            <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                                        </div>
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
                                    
                                    <div className='marketplace-left-contents'>
                                        <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                                        <span className='marketplace-left-text-product'> { product.Text }</span>
                                        
                                        <div className='marketplace-left-pricedate-product-wrapper'>
                                            <span className='marketplace-left-city-product'> { product.City }</span>

                                            <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                                        </div>
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
                                    
                                    <div className='marketplace-left-contents'>
                                        <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                                        <span className='marketplace-left-text-product'> { product.Text }</span>
                                        
                                        <div className='marketplace-left-pricedate-product-wrapper'>
                                            <span className='marketplace-left-city-product'> { product.City }</span>

                                            <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                                        </div>
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
                                    <div className='marketplace-left-contents'>
                                        <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                                        <span className='marketplace-left-text-product'> { product.Text }</span>
                                        
                                        <div className='marketplace-left-pricedate-product-wrapper'>
                                            <span className='marketplace-left-city-product'> { product.City }</span>

                                            <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                        
                    );
                })}

                {/* myproducts page => contains all products the connected user uploaded*/}
                {isMyproductsPage && marketSpecificProduct && marketSpecificProduct.map((product, index) => (
                    <div key={index} className='marketplace-left-products-wrapper'> 

                        <div className='marketplace-left-options-wrapper'>
                            {!isOptionExit ? (
                                <button className='marketplace-left-options-button' onClick={openOptions}> <SlOptionsVertical /> </button>

                            ) : (
                                <div>
                                    <button className='marketplace-left-options-button' onClick={openOptions}> <RxExit className='marketplace-left-options-button-exit' /></button>

                                    {isOption && (
                                        <ButtonGroup className='marketplace-left-options-buttons' aria-label="outlined primary button group">
                                            <Button>
                                            <Tooltip title="Delete">
                                                <IconButton>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            </Button>
                                            <Button>
                                            <Tooltip title="Edit">
                                                <Button><AiOutlineEdit /></Button>
                                            </Tooltip>
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </div>
                            )}
                        </div>      

                        <div className='marketplace-left-img-product-wrapper'>
                            {product.Image ? (
                            <img className='marketplace-left-img-product' src={ product.Image }></img>

                            ) : (
                                <span>No Image</span>
                            )}
                        </div>
                    
                        <div className='marketplace-left-contents'>
                            <span className='marketplace-left-price-product'> { product.Price } ILS</span>

                            <span className='marketplace-left-text-product'> { product.Text }</span>
                            
                            <div className='marketplace-left-pricedate-product-wrapper'>
                                <span className='marketplace-left-city-product'> { product.City }</span>

                                <span className='marketplace-left-date-product'> { (new Date(product.date)).toLocaleDateString('en-IL', ILdate) }</span>
                            </div>
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

