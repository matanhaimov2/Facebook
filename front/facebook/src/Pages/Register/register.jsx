import React, { useState, useEffect } from 'react';
import axios from 'axios';


//CSS
import './register.css';

function Register() {

    // States
    const [days, setDays] = useState(Array.from({length: 31}, (_, i) => i + 1));
    const [months, setMonths] = useState([ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]);
    const [years, setYears] = useState(Array.from( { length: (new Date().getFullYear()+1 - 1905)  }, (value, index) => 1905 + index ));
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [sex, setSex] = useState();

    // --- date to values
    const [dayselected, setDayselector] = useState(1);
    const [monthselected, setMonthselector] = useState(1);
    const [yearselected, setYearselector] = useState(1905);

    const dayChange = (event) => {
        setDayselector(event.target.value);
    };

    const monthChange = (event) => {
        setMonthselector(event.target.value);
        if(monthselected == 'January') {
            setMonthselector('01');
        }
        
    };

    const yearChange = (event) => {
        setYearselector(event.target.value);
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let data = {
            "Firstname" : firstname,
            "Lastname" : lastname,
            "Email" : email,
            "Birthday" : yearselected + '-' + monthselected + '-' + dayselected,
            "Password" : password,
            "Sex" : sex
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/register", data)

        }
        catch (err) {
            console.log(err);
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

                            <input type='email' className='register-input' onChange={(e) => setEmail(e.target.value)} placeholder='מספר נייד או דוא"ל' required/>

                            <input type='password' className='register-input' onChange={(e) => setPassword(e.target.value)} placeholder='סיסמה חדשה' required/>

                            <div className='register-birth-wrapper'>
                                <label className='register-birth-title'>תאריך לידה</label>
                                
                                <div className='register-birth-sub-wrapper'>
                                    <select defaultValue={setDayselector} className='register-date-input' onChange={ dayChange }>
                                        {days.map((day, i) => (
                                            <option value={day} key={i}>{day}</option>
                                        ))}
                                    </select>
                                    
                                    <select defaultValue={setMonthselector} className='register-date-input' onChange={ monthChange }>
                                        {months.map((month, i) => (
                                            <option value={month} key={i}>{month}, {i}</option>
                                            
                                        ))}
                                    </select>

                                    <select defaultValue={setYearselector} className='register-date-input' onChange={ yearChange }> 
                                        {years.map((year, i) => (
                                            <option value={year} key={i}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='register-sex-wrapper'>
                                <label className='register-birth-title'>מין</label>
                                
                                <div className='register-sex-sub-wrapper'>
                                    <div className='register-gender'>
                                        <label className='register-gender-title'>נקבה</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setSex('F')}/>
                                    </div>

                                    <div className='register-gender'>
                                        <label className='register-gender-title'>זכר</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setSex('M')}/>
                                    </div>
                                    
                                    <div className='register-gender'>
                                        <label className='register-gender-title'>התאמה אישית</label>
                                        <input type='checkbox' className='register-checkbox' onClick={(e) => setSex(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            
                            <a href='/login' type='submit' className='register-form-button'>הרשמה</a> {/*meanwhile href to login*/}
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