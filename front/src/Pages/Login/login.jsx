import React, { useState } from 'react';


// Languages
import { useTranslation } from 'react-i18next';


// React mui
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

//CSS
import './login.css';

// Services
import { login } from '../../Services/authService';


function Login() {

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showLoading, setShowLoading] = useState(false);


    // Translator
    const { t } = useTranslation();


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setShowLoading(true); // Show loading animation

        setShowPopup(false);

        let data = {
            "Email" : email,
            "Password" : password
        }

        const response = await login(data);

        if(response.res===true) { 
            
            localStorage.setItem('UserInfo', JSON.stringify(response.data));

            if(response.firstlogin===true) {
                window.location.href='/setprofile';
            }
            else if(response.firstlogin===false) {
                window.location.href='/home';
            }
        }
        else {
            setShowLoading(false);
            setShowPopup(true);
        }
    }

    return (
        <div className='login-wrapper'>
          
            <div className='login-title'>
                <label className='login-title'>facebook</label>
            </div>

            <div className='login-content-wrapper'>

                <div className='login-content'>
                    <div className='login-content-title-wrapper'>
                        <label className='login-content-title'>{t('login.log_to_facebook_title')}</label>
                    </div>

                    <form className='login-form' onSubmit={ handleSubmit }>
                        <div className='login-email-wrapper'>
                            <input className={`login-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setEmail(e.target.value)} placeholder={t('login.login_email_placeholder')}/>

                            {showPopup && (
                                <div className='login-error-wrapper'>
                                    <label className='login-error-title'> {t('login.login_error_title')} </label>
                                </div>
                            )}
                        </div>
                        <input type='password' className={`login-input ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => setPassword(e.target.value)} placeholder={t('login.login_password_placeholder')}/>

                        {!showLoading ? (
                            <button type='submit' className='login-form-button'>{t('login.login_sign_in_button')}</button>
                            ) : (
                            <Box type='submit' className='login-form-loading'> <CircularProgress style={{'color': 'white'}}/> </Box>
                        )}

                    </form>

                    <div className='login-button-wrapper'>
                        <a href='' className='login-button-blue'>{t('login.login_forgot_your_password?')}</a>
                    </div>
                </div>

                <div className='login-border-or-wrapper'>
                    <div className='login-border'></div>

                    <div className='login-or'>
                        <label className='or'>{t('login.login_or_seperator')}</label>
                    </div>
                    
                    <div className='login-border'></div>
                </div>

                <div className='login-button-wrapper'>
                    <a href='/register' className='login-button-green'>{t('login.login_create_new_account')}</a>
                </div>
            </div>
        </div>
    );
}

export default Login;