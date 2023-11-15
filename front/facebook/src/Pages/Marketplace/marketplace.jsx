import React, { useState, useEffect } from 'react';

// Icons


// React Icons 
import { AiOutlineShop } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { LiaGuitarSolid } from "react-icons/lia";
import { SlGameController } from "react-icons/sl";



//CSS
import './marketplace.css';

// Components

const Marketplace = () => {

    // States
    const [categtoryTitle, setCategtoryTitle] = useState(''); 




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
            <div className='marketplace-left-wrapper'>

            </div>

            <div className='marketplace-right-wrapper'>
                <div className='marketplace-right-sub-wrapper'>
                    <span className='marketplace-title'> <b> Marketplace </b> </span>

                    <div className='marketplace-search-wrapper'>
                        <input id='search-marketplace-input' className='marketplace-sub-search' placeholder="חיפוש ב-Marketplace"/>
                    </div>

                    <div className='marketplace-create-button-wrapper'>
                        <button className='marketplace-create-button'>+ יצירת מודעה חדשה </button>
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

        </div>
    );
}

export default Marketplace;