import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {

    // Translator
    const { i18n } = useTranslation();

    // List of languages
    const listOfLang = {
        "he": {
            code: "he",
            name: "עברית",
            imgSrc: "https://flagsapi.com/IL/shiny/32.png"
        },
        "en": {
            code: "en",
            name: "English",
            imgSrc: "https://flagsapi.com/US/shiny/32.png"
        }
    }

    // Default Language
    const defaultLang = listOfLang.he; // Hebrew

    // States 
    const [currLang, setCurrLang] = useState(defaultLang.code); // Default language


    // Checks if the user has already chosen a language before
    useEffect(() => {
        const lngData = localStorage.getItem('currentLanguage'); // Stored language

        // If its the first time user reloading the site, save the default language
        if (!lngData) { // Runs only at the first time someone enters the site
            localStorage.setItem('currentLanguage', JSON.stringify(defaultLang));
        }
        else {
            // If exists get it 
            const storedLang = lngData ? JSON.parse(lngData) : listOfLang.he;

            // Save the different langauge
            setCurrLang(storedLang.code);
        }
    }, []);

    // Actively change the language
    useEffect(() => {
        i18n.changeLanguage(currLang); // Special Function Imported From Module
    }, [currLang]);


    // Save the new language
    const changeLanguage = (lng) => {

        // Save lang code
        setCurrLang(lng.code)

        // Save the current language in the local storage
        localStorage.setItem('currentLanguage', JSON.stringify(lng));
    };

    // Change ltr / rtl accordingly to the current language
    useEffect(() => {
        const currentLanguageCode = currLang;

        // Get rtl/ltr
        const directionAttribute = currentLanguageCode === 'he' ? 'ltr' : 'rtl';

        // Set the new state
        document.documentElement.setAttribute('dir', directionAttribute);
        // window.location.reload();

    }, [currLang])





    return (
        <div className='language-selector-wrapper'>
            <div className='language-selector'>
                <button className='language-flag-wrapper' onClick={() => changeLanguage(listOfLang.en)}><img src={listOfLang.en.imgSrc}></img></button>
                <button className='language-flag-wrapper' onClick={() => changeLanguage(listOfLang.he)}><img src={listOfLang.he.imgSrc}></img></button>
                {/* Add more buttons for other languages */}
                
            </div>

        </div>
    );
};

export default LanguageSwitcher;
