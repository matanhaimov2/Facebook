import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

// Languages
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

// Languages source files
import he from './Assets/languages/he.json';
import en from './Assets/languages/en.json';

// Components
import App from './App';

// CSS
import './index.css';


// Language Configuration 
i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    en: { translation: en },
    // Add more languages as needed
  },
  lng: 'he', // Default language
  fallbackLng: 'he', // Fallback language if translation not found
  interpolation: {
    escapeValue: false,
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
