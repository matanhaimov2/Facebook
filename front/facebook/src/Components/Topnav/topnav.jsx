import React, { useState } from 'react';

//CSS
import './topnav.css';

// Services
import { signout } from '../../Services/authService';


function TopNav() {

    // States



    const handleSignout = async (e) => {      

      localStorage.removeItem("UserInfo");

      window.location.href='/login';

  }

    return (
        <div className='topnav-wrapper'>
          <div className='topnav-left-side'>
            <div className='topnav-sub-left-orgenaize'>
              <div className='topnav-sub-left-wrapper'>
                <button  className='topnav-button-circle'> חשבון </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle'> התראות </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle'> תפריט </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle' onClick={ handleSignout }> התנתק </button> {/*meanwhile its here untill asking shlomi if Account pop is component */}
              </div>
            </div>
          </div>


          <div className='topnav-middle-side'>
            <div className='topnav-sub-middle-wrapper'>
              <button> קבוצות </button>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <button> חנות </button>
            </div>
              
            <div className='topnav-sub-middle-wrapper'>
              <button> סרטונים </button>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <button> חברים </button>
            </div>  

            <div className='topnav-sub-middle-wrapper'>
              <button> דף הבית </button>
            </div>    
          </div>


          <div className='topnav-right-side'>
            <div className='topnav-sub-right-wrapper'>
              <div className=''>
                <label> חיפוש </label>
              </div>  

              <div className=''>
                <button> (פייסבוק) </button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default TopNav;