import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive'

// Languages
import { useTranslation } from 'react-i18next';

// React Mui
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';

// Icons
import logo from '../../Assets/Images/facebook-icon.png';
import logo1 from '../../Assets/Images/home-icon.png';
import logo2 from '../../Assets/Images/friends-icon.png';
import logo3 from '../../Assets/Images/videos-icon.png';
import logo4 from '../../Assets/Images/shop-icon.png';

// React Icons 
import { LiaUserCircleSolid } from 'react-icons/lia'
import { IoNotificationsOutline } from 'react-icons/io5'
import { IoMenuSharp } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";



//CSS
import './topnav.css';

// Services
import { handleSignOut, getAuthenticatedUser, search } from '../../Services/authService';
import { getProfileImage } from '../../Services/profileService';
import { acceptFriend, ignoreFriend } from '../../Services/friendsService';
import { newNotifications } from '../../Services/notificationsService';



const TopNav = () => {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' })


  // States
  const [imgProfile, setImgProfile] = useState(null); // Raises edit profile option
  const [isSearchBox, setIsSearchBox] = useState(false);
  const [isPhoneSearchBox, setIsPhoneSearchBox] = useState(false);

  const [searchedProfiles, setSearchedProfiles] = useState([]);
  const [notficationAlert, setNotificationAlert] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [isHamburger, setIsHamburger] = useState(false); // Raises menu for phones/tablets


  // Translator
  const { t } = useTranslation();


  // Refs
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if(!isMobile) {
          setIsSearchBox(false);
        }
        else {
          setIsPhoneSearchBox(false)
        }
        
        setOpenNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);


  useEffect(() => {

    const imgReceiver = async () => {

      let data = {
        "Email": getAuthenticatedUser()
      }

      if (getAuthenticatedUser()) {

        const response = await getProfileImage(data)

        if (response && response.res === true) { // If the response is true, update user image
          setImgProfile(response.data.userimage)
        }
      }

    }

    imgReceiver();
  }, [])

  const searchGet = async (searchPhrase) => {

    if (searchPhrase.length >= 3) {
      let data = {
        "searchPhrase": searchPhrase
      }

      // Open search results
      if(!isMobile) {
        setIsSearchBox(true)
      }
      else {
        setIsPhoneSearchBox(true)
      }

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
    console.log('here')
    window.location.href = '/profile/' + email;
  }

  const handleSignout = async (e) => {
    await handleSignOut(); // Call sign out service

  }

  useEffect(() => {
    const handleNotification = async () => {

      let data = {
        'Email': getAuthenticatedUser()
      }


      // gets all notifications of the user       
      const data_notifications = await newNotifications(data)
      // is there any notification for the user?   
      if (data_notifications && data_notifications.res === true) {
        setNotificationAlert(true)
        setNotifications(data_notifications.data);

        // theres a notification
      }
      else {
        // no notifications for the user
      }
    }

    handleNotification();
  }, [])

  const acceptFriendship = async (e, friendNotification, index) => { // when accepting friend requsest
    const friendEmail = friendNotification.Email;

    let data = {
      "Email": getAuthenticatedUser(),
      "FriendEmail": friendEmail,
      "Index": index
    }

    const friendsResponse = await acceptFriend(data);

    if (friendsResponse && friendsResponse.res === true) {

      // Delete him logicly
      const acceptedEmail = friendNotification.Email;

      // Edit the email and add accepted flag
      const updatedNotification = notifications.filter((notif) => {
        if (notif.Email !== acceptedEmail) { // how the email get changed => ask shlomi
          return notif;
        }
        else {
          notif.accepted = true;
          return notif;
        }
      })

      // Update the notifcations
      setNotifications(updatedNotification);

      // Turn off the alert if there are no notifications
      if (updatedNotification.length === 0) {
        setNotificationAlert(false);
      }
    }

  }

  const ignoreFriendship = async (e, index, friendNotification) => { // when accepting friend requsest
    let data = {
      "Email": getAuthenticatedUser(),
      "Index": index
    }

    const ignoreFriendResponse = await ignoreFriend(data);

    if (ignoreFriendResponse && ignoreFriendResponse.res === true) {

      // Delete him logicly
      const deletedEmail = friendNotification.Email;

      // Filter out the deleted email
      const updatedNotification = notifications.filter((notif) => {
        if (notif.Email !== deletedEmail) {
          return notif;
        }
      })

      setNotifications(updatedNotification);

      // notification deleted successfully

      if (updatedNotification.length === 0) {
        setNotificationAlert(false);
      }
    }

  }

  const openNotificationsHandler = () => {
    setOpenNotifications(!openNotifications);
  }


  // Handle Hamburger - for screen adjustment
  useEffect(() => {
    setIsHamburger(false)

  }, [isTabletOrMobile])

  return (
    <div className='topnav-wrapper'>
      <div className='topnav-left-side'>
        <div className={`topnav-sub-left-orgenaize ${isHamburger ? 'topnav-sub-left-screen-phone' : ''}`}>

          {isTabletOrMobile && (
            <>
            {isHamburger && (
              <div className='topnav-menu-top-phone-wrapper'>
                <span className='topnav-menu-text-phone-wrapper'>{t('topnav.topnav_menu_title')}</span>
                <button className={`topnav-exit-menu-phone ${document.documentElement.getAttribute('dir') === 'ltr' ? '' : 'rotate-180-english'}`} onClick={() => setIsHamburger(false)}><IoExitOutline /></button>
              </div>
            )}
            </>
          )}

          {imgProfile ? (
            <a href='/profile' className='topnav-user-image-wrapper' >
              <img src={imgProfile} className='topnav-user-image'></img>
            </a>
          ) : (
            <div className='topnav-user-image-wrapper'>
              <a href='/profile' className='topnav-pointer topnav-account-button'> <LiaUserCircleSolid className='topnav-account-icon' /> </a>
            </div>
          )}

          <div className='topnav-sub-left-wrapper topnav-round-wrapper'>
            {!notficationAlert ? (
              <button className='topnav-button-circle topnav-pointer' onClick={openNotificationsHandler}> <IoNotificationsOutline className='topnav-menu-icon' /> </button>
            ) : (
              <button className='topnav-button-circle topnav-pointer' onClick={openNotificationsHandler}> <IoNotificationsOutline className='topnav-menu-icon' />
                <Badge badgeContent={notifications.length} color="error">
                </Badge>
              </button>
            )}
          </div>

          <div className='topnav-sub-left-wrapper topnav-sub-left-text-phone' onClick={handleSignout}>
            <button className='topnav-button-circle topnav-pointer topnav-account-button'> {t('topnav.topnav_disconnect_title')} </button>
          </div>
            
          {/* Search For Mobile */}
          {isMobile && (
            <>
              {/* Search Other Profiles */}
              <div className='topnav-search-sub-wrapper'>

                <input id='search-profiles-input' className={`topnav-sub-search ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-rtl' : 'direction-ltr'}`} onChange={(e) => searchGet(e.target.value)} placeholder={t('topnav.topnav_search_placeholder')} />

                {/* Displayed Options */}
                {isPhoneSearchBox && (
                  <div className='topnav-search-box-wrapper' ref={searchRef}>

                    {searchedProfiles && searchedProfiles.map((profileLink, i) => (
                      <div key={i} className='topnav-search-box' onClick={(e) => { navigateToProfile(e, profileLink.email) }} >

                        <span className='topnav-search-box-title'> {profileLink.username}</span>

                        <div className='topnav-search-box-img-wrapper'>

                          {profileLink.userimages ? (
                            <img className='topnav-search-box-img' src={profileLink.userimages}></img>

                          ) : (
                            <LiaUserCircleSolid className='topnav-search-box-none-img' />
                          )}
                        </div>
                      </div>
                    ))}

                    {searchedProfiles.length === 0 && (
                      <div className='topnav-search-no-result-wrapper'>
                        <span className='topnav-search-no-result-title'>{t('topnav.topnav_search_no_result_alert')}</span>
                      </div>
                    )}

                    {!searchedProfiles && (
                      <Stack className='topnav-search-skeleton' spacing={1}>
                        {/* For other variants, adjust the size with `width` and `height` */}

                        <Skeleton variant="circular" width={40} height={40} />
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton className='topnav-search-skeleton-text' variant="text" sx={{ fontSize: '1rem' }} />

                      </Stack>
                    )}

                  </div>
                )}
              </div>
            </>
          )}

          {openNotifications && (
            <div tabIndex={0} className='topnav-notification-menu' ref={searchRef}>
              {notifications && notifications.map((notifications, index) => (
                <>
                  {notifications.accepted ? (
                    <div key={index} id={`notif-${index}`} className='topnav-sub-notification-menu' >

                      <div className='topnav-search-box-img-wrapper'>

                        {notifications.UserImage ? (
                          <img className='topnav-search-box-img' src={notifications.UserImage}></img>

                        ) : (
                          <LiaUserCircleSolid className='topnav-search-box-none-img' />
                        )}
                      </div>
                      <div className='topnav-sub-notification-menu-orgnize'>
                        <span className='topnav-sub-notification-box-title'> {notifications.Username}</span>

                        <span>{t('topnav.topnav_notifications_friend_request_accepted')}</span>

                      </div>
                    </div>
                  ) : (
                    <div key={index} id={`notif-${index}`} className={`topnav-sub-notification-menu ${document.documentElement.getAttribute('dir') === 'ltr' ? 'direction-rtl' : 'direction-ltr'}`} >

                      <div className='topnav-search-box-img-wrapper'>

                        {notifications.UserImage ? (
                          <img className='topnav-search-box-img' src={notifications.UserImage}></img>

                        ) : (
                          <LiaUserCircleSolid className='topnav-search-box-none-img' />
                        )}
                      </div>
                      <div className='topnav-sub-notification-menu-orgnize'>
                        <span className='topnav-sub-notification-box-title'> {notifications.Username}</span>

                        <span>{t('topnav.topnav_notifications_friend_request')}</span>

                      </div>

                      <div className='topnav-notification-sub-wrapper'>
                        <button className='topnav-notification-yes-button' onClick={(e) => { acceptFriendship(e, notifications, index) }}> {t('topnav.topnav_notifications_yes')} </button>

                        <button className='topnav-notification-no-button' onClick={(e) => { ignoreFriendship(e, index, notifications) }}> {t('topnav.topnav_notifications_no')} </button>
                      </div>
                    </div>
                  )}
                </>
              ))}

              {notifications.length === 0 && (
                <div className='topnav-sub-notification-menu topnav-no-notifications-title'>
                  <span>{t('topnav.topnav_notifications_none_alert')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {isTabletOrMobile && (
          <button className='topnav-left-hamburger-wrapper' onClick={() => setIsHamburger(!isHamburger)}> <IoMenuSharp /></button>

        )}
      </div>


      <div className='topnav-middle-side'>

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


      <div className={`topnav-right-side ${document.documentElement.getAttribute('dir') === 'ltr' ? 'direction-rtl' : 'direction-ltr'}`}>

        <div className='topnav-facebook-icon-wrapper'>
          <a href='/home' className='topnav-pointer'> <img className='topnav-facebook-icon' src={logo} /> </a>
        </div>

        <div className='topnav-search-wrapper'>

          {/* Search Other Profiles */}
          <div className='topnav-search-sub-wrapper'>

            <input id='search-profiles-input' className='topnav-sub-search' onChange={(e) => searchGet(e.target.value)} placeholder={t('topnav.topnav_search_placeholder')} />

            {/* Displayed Options */}
            {isSearchBox && (
              <div tabIndex={0} className='topnav-search-box-wrapper' ref={searchRef}>

                {searchedProfiles && searchedProfiles.map((profileLink, i) => (
                  <div key={i} className='topnav-search-box' onClick={(e) => { navigateToProfile(e, profileLink.email) }} >

                    <span className='topnav-search-box-title'> {profileLink.username}</span>

                    <div className='topnav-search-box-img-wrapper'>

                      {profileLink.userimages ? (
                        <img className='topnav-search-box-img' src={profileLink.userimages}></img>

                      ) : (
                        <LiaUserCircleSolid className='topnav-search-box-none-img' />
                      )}
                    </div>
                  </div>
                ))}

                {searchedProfiles.length === 0 && (
                  <div className='topnav-search-no-result-wrapper'>
                    <span className='topnav-search-no-result-title'>{t('topnav.topnav_search_no_result_alert')}</span>
                  </div>
                )}

                {!searchedProfiles && (
                  <Stack className='topnav-search-skeleton' spacing={1}>
                    {/* For other variants, adjust the size with `width` and `height` */}

                    <Skeleton variant="circular" width={40} height={40} />
                    {/* For variant="text", adjust the height via font-size */}
                    <Skeleton className='topnav-search-skeleton-text' variant="text" sx={{ fontSize: '1rem' }} />

                  </Stack>
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