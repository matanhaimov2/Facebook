import React, { useState, useEffect } from 'react';
import logo from '../../Assets/Images/facebook-icon.png'; 
import logo1 from '../../Assets/Images/home-icon.png'; 
import logo2 from '../../Assets/Images/friends-icon.png'; 
import logo3 from '../../Assets/Images/videos-icon.png'; 
import logo4 from '../../Assets/Images/shop-icon.png'; 
import logo5 from '../../Assets/Images/groups-icon.png'; 
import logo6 from '../../Assets/Images/menu-icon.png';
import logo7 from '../../Assets/Images/notification-icon.png'; 
import logo8 from '../../Assets/Images/search-icon.png'; 






//CSS
import './topnav.css';

// Services
import { signout } from '../../Services/authService';
import { receiveImage } from '../../Services/profileService';



function TopNav() {

    // States
    const [imgProfile, setImgProfile] = useState(null); // Raises edit profile option

    useEffect(() => {
        
      const imgReceiver = async () => {

          let data = {
              "Email" : localStorage.getItem('UserInfo')
          }

          const response = await receiveImage(data)

          if(response.res===true) { // If the response is true, update user image
              setImgProfile(response.data.userimage)
          }

      }

      imgReceiver();
  }, [])

    const handleSignout = async (e) => {      

      localStorage.removeItem("UserInfo");

      window.location.href='/login';

  }

    return (
        <div className='topnav-wrapper'>
          <div className='topnav-left-side'>
            <div className='topnav-sub-left-orgenaize'>
              {imgProfile ? (
                  <a href='/profile' > 
                    <img src={imgProfile} className='topnav-user-image'></img>
                  </a>
              ) :(
                <div className='topnav-user-image-wrapper'>
                  <a href='/profile' className='topnav-pointer topnav-account-button'> חשבון </a>
                </div>
              )}

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer'><img className='topnav-left-icons' src={logo7} /></button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer' ><img className='topnav-left-icons' src={logo6} /> </button>
              </div>

              <div className='topnav-sub-left-wrapper'>
                <button className='topnav-button-circle topnav-pointer topnav-account-button' onClick={ handleSignout }> התנתק </button> {/*meanwhile its here untill asking shlomi if Account pop is component */}
              </div>
            </div>
          </div>


          <div className='topnav-middle-side'>
            <div className='topnav-sub-middle-wrapper'>
            <a href='/groups' className='topnav-middle-buttons'> <img className='topnav-middle-icons' src={logo5} /></a>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <a href='/marketplace' className='topnav-middle-buttons'> <img className='topnav-middle-icons' src={logo4} /></a>
            </div>
              
            <div className='topnav-sub-middle-wrapper'>
              <a href='/videos' className='topnav-middle-buttons'> <img className='topnav-middle-icons' src={logo3} /></a>
            </div>

            <div className='topnav-sub-middle-wrapper'>
              <a href='/friends' className='topnav-middle-buttons'> <img className='topnav-middle-icons' src={logo2} /></a>
            </div>  

            <div className='topnav-sub-middle-wrapper'>
              <a href='/home' className='topnav-middle-buttons'> <img className='topnav-middle-icons' src={logo1} /></a>
            </div>    
          </div>


          <div className='topnav-right-side'>
              <div className='topnav-facebook-icon-wrapper'>
                  <a href='/home' className='topnav-pointer'> <img className='topnav-facebook-icon' src={logo} /> </a>
              </div>

              <div className='topnav-search-wrapper'>
                <input className='topnav-sub-search' placeholder="חפש בפייסבוק"/> 
              </div>  
            </div>
        </div>
    );
}

export default TopNav;