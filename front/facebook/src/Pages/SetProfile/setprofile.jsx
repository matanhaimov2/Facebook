import React, { useState } from 'react';
import axios from 'axios';


//CSS
import './setprofile.css';

function SetProfile() {

    // States
    const [username, setUsername] = useState();
    const [biography, setBiography] = useState();
    const [occupation, setOccupation] = useState();
    const [school, setSchool] = useState();
    const [address, setAddress] = useState();
    const [showPopup, setShowPopup] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setShowPopup(false)

        try {
            let data = {
                "Username" : username,
                "Biography" : biography,
                "Occupation" : occupation,
                "School" : school,
                "Address" : address
            }

            // Sends to back email and password to see if correct
            const response = await axios.post("http://127.0.0.1:5000/setprofile", data)
            console.log(response);

            if(response.data.res===true) { // If the response is true, redirect to home
                window.location.href='/home'
            }
            else {
                setShowPopup(true)
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    
    return (
        <div className='setprofile-wrapper'>
            <div className='setprofile-content-wrapper'>
            <form className='setprofile-form' onSubmit={ handleSubmit }>
                        <label className='setprofile-title-button'> פרטים נוספים</label>
                        <div className='setprofile-username-wrapper'>
                            <input type='text' className='setprofile-input' onChange={(e) => setUsername(e.target.value)} placeholder='שם המשתמש שלך (חובה)' required/>

                            {showPopup && (
                            <div className='setprofile-error-wrapper'>
                                <label className='setprofile-error-title'> Username is already taken </label>
                            </div>
                            )}
                        </div>
                        <input type='text' className='setprofile-input' onChange={(e) => setBiography(e.target.value)} placeholder='ביוגרפיה (לא חובה)'/>
                        <input type='text' className='setprofile-input' onChange={(e) => setOccupation(e.target.value)} placeholder='תעסוקה (לא חובה)'/>
                        <input type='text' className='setprofile-input' onChange={(e) => setSchool(e.target.value)} placeholder='בית הספר שבו למדת (לא חובה)'/>
                        <input type='text' className='setprofile-input' onChange={(e) => setAddress(e.target.value)} placeholder='כתובת (לא חובה)'/>


                        <button type='submit' className='setprofile-form-button'>למעבר לחשבון שלך</button>
                    </form>
            </div>
        </div>
    );
}

export default SetProfile;