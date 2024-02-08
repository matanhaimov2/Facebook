import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'


// Languages
import { useTranslation } from 'react-i18next';


// Json Files
import cities_data from '../../Assets/israel_cities.json'

// MUI
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
import DeleteCheck from '../../Components/DeleteCheck/deletecheck'

const Marketplace = () => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)' })
    
    // Params
    const { categoryTitle } = useParams();

    // States
    const [marketSpecificProduct, setMarketSpecificProduct] = useState([]); // State for specific user products
    const [marketProducts, setMarketProducts] = useState([]); // State for Allproducts
    const [extendUploadProduct, setExtendUploadPoduct] = useState(false);
    const [extendDeleteCheck, setExtendDeleteCheck] = useState(false);
    const [isOption, setIsOption] = useState(false); // state for options on a product
    const [isOptionExit, setIsOptionExit] = useState(false); // state for options on a product
    const [currentOption, setCurrentOption] = useState();
    const [isEditProduct, setIsEditProduct] = useState(false); // Raises edit profile option
    const [reGetData, setReGetData] = useState(false);
    const [isCategoriesPhone, setIsCategoriesPhone] = useState(false);
    // States - City
    const [isEditCity, setIsEditCity] = useState(false); // Open cities menu
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(cities_data);
    const [cityFilter, setCityFilter] = useState('הכל'); // for filtering product according to selected city


    // Translator
    const { t } = useTranslation();


    // Navigateor
    const navigate = useNavigate();

    // Pathnames handle
    const currentPathname = window.location.pathname;
    const isMarketplacePage = currentPathname.endsWith('/marketplace');
    const isMyproductsPage = currentPathname.endsWith('/marketplace/myproducts');


    // Navigate to different categories (vehicles, instruments, games, etc...)
    const navigateToCategory = (e, title) => {
        e.preventDefault();
        setCityFilter('הכל');

        navigate('/marketplace/' + title);
    }

    // Navigate to allproducts from all users category. http://SERVER_URL/marketplace
    const navigateToEverythingCategory = (e) => {
        e.preventDefault();
        setCityFilter('הכל');

        navigate('/marketplace');
    }


    useEffect(() => {

        const MarketProducts = async () => {

            let data;

            data = {
                "Email": getAuthenticatedUser()
            }


            if (getAuthenticatedUser()) {

                const all_response = await getSpecificProduct(data) // Gets all products from the specific user signed in
                if (all_response && all_response.res === true) {
                    setMarketSpecificProduct(all_response.data);
                }

                const response = await getAllProduct(data) // Gets all products from all users
                if (response && response.res === true) {
                    setMarketProducts(response.data);
                }
                else {
                    setMarketSpecificProduct([]);
                    setMarketProducts([]);
                }
            }

        }

        MarketProducts();

    }, [reGetData])

    const openOptions = (index) => {
        setIsOption(!isOption);
        setIsOptionExit(!isOptionExit);
        setCurrentOption(index);
    }


    // Search products for a specific city from cities api

    const handleInputChange = (event) => { // when user changes input
        const { value } = event.target;
        setSearchTerm(value);
        filterData(value);
    };

    const filterData = (searchTerm) => { // filtered displayed data(cities) according to searchTerm

        if (document.documentElement.getAttribute('dir') === 'ltr') { // language of site set to hebrew
            var filteredData = cities_data.filter((item) =>
                item.name.includes(searchTerm)
            );
        }
        else { // language of site set to english
            var filteredData = cities_data.filter((item) =>
                item.english_name.includes(searchTerm)
            );
        }
        setFilteredData(filteredData);
    };

    const handleCityClick = (city_english_name) => { // when user clickes on a city to filter
        setCityFilter(capitalizeWords(city_english_name));
        setIsEditCity(!isEditCity);
        setSearchTerm('');
    }

    const capitalizeWords = (city_english_name) => { // uppercase the selected city(from 'two words' => 'Two Words')
        return city_english_name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }


    // Formats date from month/day/year to day/month/year
    const ILdate = { day: 'numeric', month: 'numeric', year: 'numeric' };

    return (
        <div className={`marketplace-wrapper ${document.documentElement.getAttribute('dir') === 'ltr' ? 'direction-rtl' : 'direction-ltr'}`}>

            <div className='marketplace-right-background-wrapper'>
                <div className='marketplace-right-wrapper'>
                    {!isTabletOrMobile ? (
                        <div className='marketplace-right-sub-wrapper'>
                            <span className='marketplace-title'> <b> Marketplace </b> </span>

                            <div className='marketplace-search-wrapper'>
                                <input id='search-marketplace-input' className='marketplace-sub-search' placeholder={t('marketplace.marketplace_search_placeholder')} />
                            </div>

                            <div className='marketplace-create-button-wrapper'>
                                <button className='marketplace-create-button' onClick={() => setExtendUploadPoduct(!extendUploadProduct)}>{t('marketplace.marketplace_create_new_product')}</button>
                            </div>

                            <div className='marketplace-border-wrapper'>
                                <div className='marketplace-border'></div>
                            </div>

                            <div className='marketplace-filter-wrapper'>
                                <span className='marketplace-filter-title'> <b>{t('marketplace.marketplace_filter_title')}</b> </span>

                                <div className='marketplace-filter-button-wrapper'>
                                    <span className='marketplace-filter-title'> {cityFilter} </span>
                                    <button className='marketplace-filter-button' onClick={() => setIsEditCity(!isEditCity)}>{t('marketplace.marketplace_edit_button')}</button>
                                    {isEditCity && (
                                        <div className='marketplace-filter-cities-wrapper'>
                                            <input className='marketplace-filter-cities-search' type="text" placeholder={t('marketplace.marketplace_city_search_placeholder')} value={searchTerm} onChange={handleInputChange} />

                                            {isEditCity && searchTerm.length >= 2 && (
                                                filteredData.map((item, i) => (
                                                    <div key={i} className='marketplace-filter-cities'>
                                                        {document.documentElement.getAttribute('dir') === 'ltr' ? (
                                                            <button className='marketplace-filter-cities-button' onClick={() => handleCityClick(item.english_name)}>{item.name}</button>
                                                        ) : (
                                                            <button className='marketplace-filter-cities-button' onClick={() => handleCityClick(item.english_name)}>{item.english_name}</button>
                                                        )}
                                                    </div>
                                                ))
                                            )}

                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className='marketplace-border-wrapper'>
                                <div className='marketplace-border'></div>
                            </div>

                            <div className='marketplace-category-wrapper'>
                                <span className='marketplace-category-title'> <b> {t('marketplace.marketplace_categories_title')} </b> </span>

                                <div className='marketplace-category-sub-wrapper'>
                                    <div className='marketplace-category' onClick={(e) => { navigateToEverythingCategory(e) }}>
                                        <div className='marketplace-category-round-wrapper'>
                                            <button className='marketplace-button-circle'> <AiOutlineShop className='topnav-menu-icon' /> </button>
                                        </div>
                                        <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_everything_title')}</span>
                                    </div>

                                    <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'vehicles') }}>
                                        <div className='marketplace-category-round-wrapper'>
                                            <button className='marketplace-button-circle'> <FaCar className='topnav-menu-icon' /> </button>
                                        </div>
                                        <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_vehicles_title')}</span>
                                    </div>

                                    <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'electronics') }}>
                                        <div className='marketplace-category-round-wrapper'>
                                            <button className='marketplace-button-circle'> <MdOutlinePhoneAndroid className='topnav-menu-icon' /> </button>
                                        </div>
                                        <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_electronics_title')}</span>
                                    </div>

                                    <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'instruments') }}>
                                        <div className='marketplace-category-round-wrapper'>
                                            <button className='marketplace-button-circle'> <LiaGuitarSolid className='topnav-menu-icon' /> </button>
                                        </div>
                                        <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_instruments_title')}</span>
                                    </div>

                                    <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'games') }}>
                                        <div className='marketplace-category-round-wrapper'>
                                            <button className='marketplace-button-circle'> <SlGameController className='topnav-menu-icon' /> </button>
                                        </div>
                                        <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_games_and_toys_title')}</span>
                                    </div>

                                    <div className='marketplace-create-button-wrapper'>
                                        <button className='marketplace-create-button' onClick={(e) => { navigateToCategory(e, 'myproducts') }}>{t('marketplace.marketplace_my_products_title')}</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className='marketplace-right-sub-phone-wrapper'>
                            <div className='marketplace-right-sub-phone-one'>
                                <div className='marketplace-titleandsearch-phone-wrapper'>
                                    <span className='marketplace-title'> <b> Marketplace </b> </span>

                                    <div className='marketplace-search-wrapper'>
                                        <input id='search-marketplace-input' className='marketplace-sub-search' placeholder={t('marketplace.marketplace_search_placeholder')} />
                                    </div>
                                </div>

                                <div className='marketplace-filter-wrapper'>
                                    <span className='marketplace-filter-title'> <b>{t('marketplace.marketplace_filter_title')}</b> </span>

                                    <div className='marketplace-filter-button-wrapper'>
                                        <span className='marketplace-filter-title'> {cityFilter} </span>
                                        <button className='marketplace-filter-button' onClick={() => setIsEditCity(!isEditCity)}>{t('marketplace.marketplace_edit_button')}</button>
                                        {isEditCity && (
                                            <div className='marketplace-filter-cities-wrapper'>
                                                <input className='marketplace-filter-cities-search' type="text" placeholder={t('marketplace.marketplace_city_search_placeholder')} value={searchTerm} onChange={handleInputChange} />

                                                {isEditCity && searchTerm.length >= 2 && (
                                                    filteredData.map((item, i) => (
                                                        <div key={i} className='marketplace-filter-cities'>
                                                            {document.documentElement.getAttribute('dir') === 'ltr' ? (
                                                                <button className='marketplace-filter-cities-button' onClick={() => handleCityClick(item.english_name)}>{item.name}</button>
                                                            ) : (
                                                                <button className='marketplace-filter-cities-button' onClick={() => handleCityClick(item.english_name)}>{item.english_name}</button>
                                                            )}
                                                        </div>
                                                    ))
                                                )}

                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            <div className='marketplace-border-wrapper'>
                                <div className='marketplace-border'></div>
                            </div>

                            <div className='marketplace-right-sub-phone-two'>

                                <div className='marketplace-create-button-wrapper'>
                                    <button className='marketplace-create-button' onClick={() => setIsCategoriesPhone(!isCategoriesPhone)}>קטגוריות</button>

                                    {isCategoriesPhone && (
                                        <div className='marketplace-category-phone-wrapper'>

                                            <div className='marketplace-category-sub-wrapper' onClick={() => setIsCategoriesPhone(!isCategoriesPhone)}>

                                                <div className='marketplace-category' onClick={(e) => { navigateToEverythingCategory(e) }}>
                                                    <div className='marketplace-category-round-wrapper'>
                                                        <button className='marketplace-button-circle'> <AiOutlineShop className='topnav-menu-icon' /> </button>
                                                    </div>
                                                    <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_everything_title')}</span>
                                                </div>

                                                <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'vehicles') }}>
                                                    <div className='marketplace-category-round-wrapper'>
                                                        <button className='marketplace-button-circle'> <FaCar className='topnav-menu-icon' /> </button>
                                                    </div>
                                                    <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_vehicles_title')}</span>
                                                </div>

                                                <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'electronics') }}>
                                                    <div className='marketplace-category-round-wrapper'>
                                                        <button className='marketplace-button-circle'> <MdOutlinePhoneAndroid className='topnav-menu-icon' /> </button>
                                                    </div>
                                                    <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_electronics_title')}</span>
                                                </div>

                                                <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'instruments') }}>
                                                    <div className='marketplace-category-round-wrapper'>
                                                        <button className='marketplace-button-circle'> <LiaGuitarSolid className='topnav-menu-icon' /> </button>
                                                    </div>
                                                    <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_instruments_title')}</span>
                                                </div>

                                                <div className='marketplace-category' onClick={(e) => { navigateToCategory(e, 'games') }}>
                                                    <div className='marketplace-category-round-wrapper'>
                                                        <button className='marketplace-button-circle'> <SlGameController className='topnav-menu-icon' /> </button>
                                                    </div>
                                                    <span className='marketplace-sub-category-title'>{t('marketplace.marketplace_games_and_toys_title')}</span>
                                                </div>

                                                <div className='marketplace-myproducts-phone-wrapper'>
                                                    <button className='marketplace-create-button' onClick={(e) => { navigateToCategory(e, 'myproducts') }}>{t('marketplace.marketplace_my_products_title')}</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className='marketplace-create-button-wrapper'>
                                    <button className='marketplace-create-button' onClick={() => setExtendUploadPoduct(!extendUploadProduct)}>{t('marketplace.marketplace_create_new_product')}</button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className='marketplace-left-wrapper'>

                {/* marketplace page => contains all the products */}
                {isMarketplacePage && marketProducts && marketProducts.flat()
                    .filter((item) => {
                        const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.

                        // Check if cityFilter is 'anything' or if product.City matches the cityFilter
                        return cityFilter === 'הכל' || product.City === cityFilter;
                    })
                    .map((productString, index) => { // flatten the array of arrays into a single array
                        const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                        return (
                            <div key={index} className='marketplace-left-products-wrapper'>

                                <div className='marketplace-left-img-product-wrapper'>
                                    {product.Image ? (
                                        <img className='marketplace-left-img-product' src={product.Image}></img>

                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </div>

                                <div className='marketplace-left-contents'>
                                    <span className='marketplace-left-price-product'> {product.Price} ILS</span>

                                    <span className='marketplace-left-text-product'> {product.Text}</span>

                                    <div className='marketplace-left-pricedate-product-wrapper'>
                                        <span className='marketplace-left-city-product'> {product.City}</span>

                                        <span className='marketplace-left-date-product'> {(new Date(product.date)).toLocaleDateString('en-IL', ILdate)}</span>
                                    </div>
                                </div>

                            </div>
                        );
                    })}


                {/* all pages => contains all products in categoryTitle veriable category, categoryTitle could be games, vehicles,.....*/}
                {marketProducts && marketProducts.flat()
                    .filter((item) => {
                        const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.

                        // Check if cityFilter is 'anything' or if product.City matches the cityFilter
                        return product.Category === categoryTitle && (cityFilter === 'הכל' || product.City === cityFilter);
                    })
                    .map((productString, index) => { // flatten the array of arrays into a single array
                        const product = JSON.parse(productString); //  convert the JSON string into a JavaScript object
                        return (
                            <div key={index} className='marketplace-left-products-wrapper'>

                                {product.Category === categoryTitle && (
                                    <>
                                        <div className='marketplace-left-img-product-wrapper'>
                                            {product.Image ? (
                                                <img className='marketplace-left-img-product' src={product.Image}></img>

                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </div>

                                        <div className='marketplace-left-contents'>
                                            <span className='marketplace-left-price-product'> {product.Price} ILS</span>

                                            <span className='marketplace-left-text-product'> {product.Text}</span>

                                            <div className='marketplace-left-pricedate-product-wrapper'>
                                                <span className='marketplace-left-city-product'> {product.City}</span>

                                                <span className='marketplace-left-date-product'> {(new Date(product.date)).toLocaleDateString('en-IL', ILdate)}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                            </div>

                        );
                    })}


                {/* myproducts page => contains all products the connected user uploaded*/}
                {isMyproductsPage && marketSpecificProduct && marketSpecificProduct
                    .filter((item) => {
                        const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.

                        // Check if cityFilter is 'anything' or if product.City matches the cityFilter
                        return cityFilter === 'הכל' || product.City === cityFilter;
                    })
                    .map((product, index) => (
                        <div key={index} className='marketplace-left-products-wrapper'>

                            <div className={`marketplace-left-options-wrapper ${document.documentElement.getAttribute('dir')==='ltr' ? 'position-left' : 'position-right'}`}>
                                {!isOptionExit && currentOption !== index ? (
                                    <button className='marketplace-left-options-button' onClick={() => { openOptions(index) }}> <SlOptionsVertical /> </button>
                                ) : (
                                    <div>

                                        {isOption && currentOption === index && (
                                            <>
                                                <button className='marketplace-left-options-button' onClick={openOptions}> <RxExit className='marketplace-left-options-button-exit' /></button>

                                                <ButtonGroup className='marketplace-left-options-buttons' aria-label="outlined primary button group">
                                                    <Button onClick={() => setExtendDeleteCheck(!extendDeleteCheck)}>
                                                        <Tooltip title="Delete">
                                                            <IconButton>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Button>
                                                    <Button onClick={() => setIsEditProduct(true)}>
                                                        <Tooltip title="Edit">
                                                            <Button>
                                                                <AiOutlineEdit />
                                                            </Button>
                                                        </Tooltip>
                                                    </Button>
                                                </ButtonGroup>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className='marketplace-left-img-product-wrapper'>
                                {product.Image ? (
                                    <img className='marketplace-left-img-product' src={product.Image}></img>

                                ) : (
                                    <span>No Image</span>
                                )}
                            </div>

                            <div className='marketplace-left-contents'>
                                <span className='marketplace-left-price-product'> {product.Price} ILS</span>

                                <span className='marketplace-left-text-product'> {product.Text}</span>

                                <div className='marketplace-left-pricedate-product-wrapper'>
                                    <span className='marketplace-left-city-product'> {product.City}</span>

                                    <span className='marketplace-left-date-product'> {(new Date(product.date)).toLocaleDateString('en-IL', ILdate)}</span>
                                </div>
                            </div>
                        </div>
                    ))}


                {/* Display no products availble - when there are no products */}
                {marketProducts && marketProducts.flat()
                    .filter((item) => {
                        const product = typeof item === 'string' ? JSON.parse(item) : item; // if item is a string, convert to js object, else keep it as is.

                        // Check if cityFilter is 'anything' or if product.City matches the cityFilter
                        return cityFilter === 'הכל' || product.City === cityFilter;
                    }).length === 0 && (
                        <div>
                            {t('marketplace.marketplace_no_products_alert')}
                        </div>
                    )}

                {extendUploadProduct && (
                    <div className='marketplace-left-productupload-wrapper'>
                        <ProductUpload setExtendUploadPoduct={setExtendUploadPoduct} />
                    </div>
                )}

                {isEditProduct && (
                    <div className='marketplace-left-productupload-wrapper'>
                        <ProductUpload isUpdateProduct={isEditProduct} setIsEditProduct={setIsEditProduct} updatePage={setReGetData} updatePageCurrentState={reGetData} selectedOption={currentOption} />
                    </div>
                )}

                {extendDeleteCheck && (
                    <div className='marketplace-left-productupload-wrapper'>
                        <DeleteCheck setExtendDeleteCheck={setExtendDeleteCheck} selectedOption={currentOption} />
                    </div>
                )}
            </div>

        </div>
    );
}

export default Marketplace;

