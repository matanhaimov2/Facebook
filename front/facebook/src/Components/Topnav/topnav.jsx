import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

// Icons
import logo from '../../Assets/Images/facebook-icon.png'; 
import logo1 from '../../Assets/Images/home-icon.png'; 
import logo2 from '../../Assets/Images/friends-icon.png'; 
import logo3 from '../../Assets/Images/videos-icon.png'; 
import logo4 from '../../Assets/Images/shop-icon.png'; 
import logo5 from '../../Assets/Images/groups-icon.png';  

// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'
import { CgMenuGridO } from 'react-icons/cg'
import { IoNotificationsOutline } from 'react-icons/io5'

//CSS
import './topnav.css';

// Services
import { handleSignOut, getAuthenticatedUser, search } from '../../Services/authService';
import { getProfileImage } from '../../Services/profileService';


const TopNav = () => {

  // States
  const [imgProfile, setImgProfile] = useState(null); // Raises edit profile option
  const [isSearchBox, setIsSearchBox] = useState(false); 
  const [searchedProfiles, setSearchedProfiles] = useState([]); 

  // Navigator
  const navigate = useNavigate();

  useEffect(() => {
      
    const imgReceiver = async () => {
        
      let data = {
        "Email" : getAuthenticatedUser()
      }

      if(getAuthenticatedUser()) {

        const response = await getProfileImage(data)

        if(response && response.res===true) { // If the response is true, update user image
            setImgProfile(response.data.userimage)
        }
      }

    }

    imgReceiver();
  }, [])


  const searchGet = async (searchPhrase) => {

    if(searchPhrase.length >= 3) {
      let data = {
        "searchPhrase" : searchPhrase
      }

      // Open search results
      setIsSearchBox(true)

      // Get profile results from user  
      const response = await search(data)
      const results = response.data;

      // Filter the user logged in from the results
      const filteredResults = results.filter(result => {
        return result.email !== getAuthenticatedUser();
      });
   
      // Save the results
      setSearchedProfiles(filteredResults)
    }
    else {
      setIsSearchBox(false)
    }
  }

  const navigateToProfile = (e, email) => {
    e.preventDefault(); 
    
    window.location.href = '/profile/' + email;
  }

  const handleSignout = async (e) => {      
    await handleSignOut(); // Call sign out service

  }

  return (
    <div className='topnav-wrapper'>
      <div className='topnav-left-side'>
        <div className='topnav-sub-left-orgenaize'>
          {imgProfile ? (
              <a href='/profile' className='topnav-user-image-wrapper' > 
                <img src={imgProfile} className='topnav-user-image'></img>
              </a>
          ) :(
            <div className='topnav-user-image-wrapper'>
              <a href='/profile' className='topnav-pointer topnav-account-button'> <LiaUserCircleSolid className='topnav-account-icon'/> </a>
            </div>
          )}

          <div className='topnav-sub-left-wrapper topnav-round-wrapper'>
            <button className='topnav-button-circle topnav-pointer'> <IoNotificationsOutline className='topnav-menu-icon' /> </button>
          </div>

          <div className='topnav-sub-left-wrapper topnav-round-wrapper'>
            <button className='topnav-button-circle topnav-pointer' > <CgMenuGridO className='topnav-menu-icon' /> </button>
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

            {/* Search Other Profiles */}
            <div className='topnav-search-sub-wrapper'>
              
              <input id='search-profiles-input' className='topnav-sub-search' onChange={(e) => searchGet(e.target.value)} placeholder="חפש בפייסבוק"/>
              
              {/* Displayed Options */}
              {isSearchBox && (
                <div className='topnav-search-box-wrapper'>
                  {searchedProfiles && searchedProfiles.map((profileLink, i) => (
                    <div key={i} className='topnav-search-box' onClick={(e) => {navigateToProfile(e, profileLink.email)}}>
                      
                      <span className='topnav-search-box-title'> { profileLink.username }</span>
                      
                      <div className='topnav-search-box-img-wrapper'>

                        {profileLink.userimages ? (
                          <img className='topnav-search-box-img' src={ profileLink.userimages }></img>

                        ) : (
                          <LiaUserCircleSolid className='topnav-search-box-none-img'/>
                        )}
                      </div>
                    </div>
                  ))}

                  {searchedProfiles.length===0 && (
                    <div className='topnav-search-no-result-wrapper'>
                      <span className='topnav-search-no-result-title'>אין תוצאות חיפוש</span>
                    </div>
                  )}
                  

                </div>
              )} 
            </div>

          </div>  
        </div>
    </div>
  );
}

export default TopNav;