import React, { useState } from 'react';


//CSS
import './login.css';

function Login() {

    
    return (
        <div className='login-wrapper'>
          
            <div className='login-title'>
                <label className='login-title'>facebook</label>
            </div>
            
            <div className='login-content-wrapper'>

                <div className='login-content'>
                    <div className='login-content-title-wrapper'>
                        <label className='login-content-title'>התחבר\י לפייסבוק</label>
                    </div>

                    <form className='login-form'>
                        <input className='login-input' placeholder='דוא"ל או מספר טלפון'/>
                        <input type='password' className='login-input' placeholder='סיסמה'/>
                        <button type='submit' className='login-form-button'>התחברות</button>
                    </form>

                    <div className='login-button-wrapper'>
                        <a href='/register' className='login-button-blue'>שכחת את החשבון?</a>
                    </div>
                </div>

                <div className='login-border-or-wrapper'>
                    <div className='login-border'></div>

                    <div className='login-or'>
                        <label className='or'>או</label>
                    </div>
                    
                    <div className='login-border'></div>
                </div>

                <div className='login-button-wrapper'>
                    <button className='login-button-green'>צור חשבון חדש</button>
                </div>
            </div>
        </div>
    );
}

export default Login;