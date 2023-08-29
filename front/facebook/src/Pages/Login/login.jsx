import React, { useState } from 'react';
import axios from 'axios';


//CSS
import './login.css';

function Login() {

    // States
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPopup, setShowPopup] = useState(false);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        try {
            let data = {
                "Email" : email,
                "Password" : password
            }

            // Sends to back email and password to see if correct
            const response = await axios.post("http://127.0.0.1:5000/login", data)
            console.log(response);

            if(response.data.res===true) { // If the response is true, redirect to home
                if(response.data.firstlogin===true) {
                    window.location.href='/setprofile'
                }
                else if(response.data.firstlogin===false) {
                    window.location.href='/home'
                }
            }
            else {
                setShowPopup(true);
            }
        }
        catch (err) {
            console.log(err);
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
                        <label className='login-content-title'>התחבר\י לפייסבוק</label>
                    </div>

                    <form className='login-form' onSubmit={ handleSubmit }>
                        <input className='login-input' onChange={(e) => setEmail(e.target.value)} placeholder='דוא"ל או מספר טלפון'/>
                        <input type='password' className='login-input' onChange={(e) => setPassword(e.target.value)} placeholder='סיסמה'/>
                        <button type='submit' className='login-form-button'>התחברות</button>
                        {showPopup && (
                            <div className='login-error-wrapper'>
                                <label className='login-error-title'> Email or Password are Incorrect </label>
                            </div>
                        )}
                    </form>

                    <div className='login-button-wrapper'>
                        <a href='' className='login-button-blue'>שכחת את החשבון?</a>
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
                    <a href='/register' className='login-button-green'>צור חשבון חדש</a>
                </div>
            </div>
        </div>
    );
}

export default Login;