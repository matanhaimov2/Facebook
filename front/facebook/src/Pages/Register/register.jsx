import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

//CSS
import './register.css';

// Services
import { register } from '../../Services/authService';

function Register() {

    // States
    const [days, setDays] = useState(Array.from({length: 31}, (_, i) => i + 1));
    const [months, setMonths] = useState([ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]);
    const [years, setYears] = useState(Array.from( { length: (new Date().getFullYear()+1 - 1905)  }, (value, index) => 1905 + index ));
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [sex, setSex] = useState('M');
    const [showPopup, setShowPopup] = useState(false);
    const [showLoading, setShowLoading] = useState(false);



    // --- date to values
    const [dayselected, setDayselector] = useState(1);
    const [monthselected, setMonthselector] = useState(1);
    const [yearselected, setYearselector] = useState(new Date().getFullYear());

    const dayChange = (event) => {
        setDayselector(event.target.value);
    };

    const monthChange = (event) => {
        setMonthselector(event.target.value);
    };

    const yearChange = (event) => {
        setYearselector(event.target.value);
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setShowLoading(true); // Show loading animation

        
        setShowPopup(false);

        let data = {
            "Firstname" : firstname,
            "Lastname" : lastname,
            "Email" : email,
            "Birthday" : yearselected + '-' + ( new Date(monthselected + ' 1, 2022').getMonth() + 1 ) + '-' + dayselected,
            "Password" : password,
            "Sex" : sex
        }
        
        const response = await register(data);

        if(response.res===true) { // If the response is true, redirect to login
            window.location.href = '/login';
        }
        else {
            setShowLoading(false);
            setShowPopup(true);
        }

    }


    return (
        <div className='register-page'>
            <div className='register-wrapper'>
            
                <div className='register-title'>
                    <label className='register-title'>facebook</label>
                </div>
                
                <div className='register-content-wrapper'>

                    <div className='register-content'>
                        <div className='register-content-title-wrapper'>
                            <label className='register-content-title'>צור חשבון חדש</label> 
                            <label className='register-content-sub-title'>.זה מהיר וקל</label>
                        </div>

                        <form className='register-form' onSubmit={ handleSubmit }>
                            <div className='register-name-wrapper'>
                                <input className='register-name-input' onChange={(e) => setFirstname(e.target.value)} placeholder='שם פרטי' required/>
                                <input className='register-name-input' onChange={(e) => setLastname(e.target.value)}placeholder='שם משפחה' required/>
                            </div>

                            <div className='register-email-wrapper'>
                                <input type='email' className='register-input' onChange={(e) => setEmail(e.target.value)} placeholder='מספר נייד או דוא"ל' required/>
                                
                                {showPopup && (
                                    <div className='register-error-wrapper'>
                                        <label  className='register-error-title'> Email is taken. please try another one </label>
                                    </div>

                                )}
                            </div>

                            <input type='password' className='register-input' onChange={(e) => setPassword(e.target.value)} placeholder='סיסמה חדשה' required/>

                            <div className='register-birth-wrapper'>
                                <label className='register-birth-title'>תאריך לידה</label>
                                
                                <div className='register-birth-sub-wrapper'>
                                    <select defaultValue={dayselected} className='register-date-input' onChange={ dayChange }>
                                        {days.map((day, i) => (
                                            <option value={day} key={i}>{day}</option>
                                        ))}
                                    </select>
                                    
                                    <select defaultValue={monthselected} className='register-date-input' onChange={ monthChange }>
                                        {months.map((month, i) => (
                                            <option value={month} key={i + 1}>{month}</option>
                                            
                                        ))}
                                    </select>

                                    <select defaultValue={yearselected} className='register-date-input' onChange={ yearChange }> 
                                        {years.map((year, i) => (
                                            <option value={year} key={i}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='register-sex-wrapper'>
                                <label className='register-birth-title'>מין</label>
                                
                                <div className='register-sex-sub-wrapper'>
                                    <FormControl>
                                        <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue={'male'} name="radio-buttons-group">
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setSex('M')} value="male" control={<Radio />} label="זכר" />
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setSex('F')} value="female" control={<Radio />} label="נקבה" />
                                            <FormControlLabel className='register-sex-button' onClick={(e) => setSex(e.target.value)} value="other" control={<Radio />} label="התאמה אישית" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>

                            {!showLoading ? (
                                <button type='submit' className='login-form-button'>הרשמה</button>
                            ) : (
                                <Box type='submit' className='login-form-loading'> <CircularProgress style={{'color': 'white'}}/> </Box>
                            )}
                        </form>

                        <div className='register-button-wrapper'>
                            <a href='/login' className='register-button-blue'>כבר יש לך חשבון?</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;