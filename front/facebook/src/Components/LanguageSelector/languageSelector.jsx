import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    
    // Translator
    const { i18n } = useTranslation();

    // List of languages
    const listOfLang = {
        "he" : {
            code : "he",
            name : "עברית",
            imgSrc : "add here path to flag"
        },
        "en" : {
            code : "en",
            name : "English",
            imgSrc : "add here path to flag"
        }
    }

    // Default Language
    const defaultLang = listOfLang.he; // Hebrew

    // States 
    const [currLang, setCurrLang] = useState(defaultLang.code); // Default language
    
  
    // If there were already language change before remember it
    useEffect(() => {
        const lngData = localStorage.getItem('currentLanguage'); // Stored language
        
        // IF the first time save the default language
        if(!lngData) { // Runs only at the first time someone enters the site
            localStorage.setItem('currentLanguage', JSON.stringify(defaultLang));  
        }
        else {
            // If exists get it 
            const storedLang = lngData ? JSON.parse(lngData) : listOfLang.he;

            // Save the different langauge
            setCurrLang(storedLang.code);
        }
    }, []);

    // Activly change the language
    useEffect(() => {
        i18n.changeLanguage(currLang);
    }, [currLang]);

    // Change ltr / rtl accordingly to the current language
    useEffect(() => {
        const currentLanguageCode = currLang;
        
        // Get rtl/ltr
        const directionAttribute = currentLanguageCode === 'he' ? 'ltr' : 'rtl';
        
        // Set the new state
        document.documentElement.setAttribute('dir', directionAttribute);

    }, [currLang])


    // Save the new language
    const changeLanguage = (lng) => {
        
        // Save lang code
        setCurrLang(lng.code)

        // Save the current lanugae in the local storage
        localStorage.setItem('currentLanguage', JSON.stringify(lng));
    };


    return (
        <div className='language-selector-wrapper'>
            <div>
                <button onClick={() => changeLanguage(listOfLang.en)}>{ listOfLang.en.name }</button>
                <button onClick={() => changeLanguage(listOfLang.he)}>{ listOfLang.he.name }</button>
                {/* Add more buttons for other languages */}
            </div>
        
        </div>
    );
};

export default LanguageSwitcher;
