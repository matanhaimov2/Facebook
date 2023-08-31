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
                <button  className='topnav-button-circle topnav-pointer'> חשבון </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer'> התראות </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer'> תפריט </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer' onClick={ handleSignout }> התנתק </button> {/*meanwhile its here untill asking shlomi if Account pop is component */}
              </div>
            </div>
          </div>


          <div className='topnav-middle-side'>
            <div className='topnav-sub-middle-wrapper'>
              <button className='topnav-pointer'> קבוצות </button>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <button className='topnav-pointer'> חנות </button>
            </div>
              
            <div className='topnav-sub-middle-wrapper'>
              <button className='topnav-pointer'> סרטונים </button>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <button className='topnav-pointer'> חברים </button>
            </div>  

            <div className='topnav-sub-middle-wrapper'>
              <button className='topnav-pointer'> דף הבית </button>
            </div>    
          </div>


          <div className='topnav-right-side'>
            <div className='topnav-sub-right-wrapper'>
              <div className='topnav-search-wrapper'>
                <input className='topnav-sub-search' placeholder="חפש..."/> 
              </div>  

              <div className='topnav-search-wrapper'>
                <button className='topnav-pointer'> (פייסבוק) </button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default TopNav;