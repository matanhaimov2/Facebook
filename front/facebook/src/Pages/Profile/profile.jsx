import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';

// Images & Icoms
import workIcon from '../../Assets/Images/work-mini-icon.png'; 
import schoolIcon from '../../Assets/Images/school-mini-icon.png'; 
import birthIcon from '../../Assets/Images/birth-mini-icon.png'; 
import locationIcon from '../../Assets/Images/location-mini-icon.png'; 
import heartIcon from '../../Assets/Images/heart-mini-icon.png'; 
import editIcon from '../../Assets/Images/edit-icon.png'; 
import searchIcon from '../../Assets/Images/search-icon.png'; 
import exitIcon from '../../Assets/Images/exit-icon.png'; 
import plusIcon from '../../Assets/Images/plus-icon.png'; 

// React Icons
import { LiaUserCircleSolid } from 'react-icons/lia'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'

// CSS
import './profile.css';

// Services
import { profile, profileImgbb, uploadImage, getProfileImage, deleteProfileImage, checkFriend, hasFriendsAtAll, startFriendRequest, deleteFriendRequest, getPendingFriend} from '../../Services/profileService';
import { getAuthenticatedUser } from '../../Services/authService'

// Components
import SetProfile from '../SetProfile/setprofile';
import PostUpload from '../../Components/Postupload/postupload';
import DisplayFriends from '../../Components/DisplayFriends/displayfriends';


function Profile() {

    const { profileEmail } = useParams();
    
    // States
    const [profileInfo, setProfileinfo] = useState({});
    const [friendsNumber, setIsFriendsNumber] = useState();

    
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [formattedDate, setFormattedDate] = useState(''); // Define formattedDate
    const [formattedRelation, setFormattedRelation] = useState(''); // Define formattedRelationship
    const [isEditProfile, setIsEditProfile] = useState(false); // Raises edit profile option
    const [imgProfile, setImgProfile] = useState(null); // 
    const [imgProfileTrigger, setImgProfileTrigger] = useState(false); // Trigger to pull image profile
    const [isFriends, setIsFriends] = useState(false);
    const [friendPending, setFriendPending] = useState(false);
    const [isDisplayFriends, setIsDisplayFriends] = useState(false); // Raises friends display

    
   

    
    const formatDate = (inputDateStr) => { // Date formatting to a normal structure (dd/mm/yyyy)
        const inputDate = new Date(inputDateStr);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = inputDate.getFullYear();
      
        setFormattedDate(`${day}/${month}/${year}`);
    }

    const formatRelationship = (inputRelationStatusEnglish) => { // Realtionship status formatting to hebrew
        if (inputRelationStatusEnglish === 'Not in a Relationship')
        {
            setFormattedRelation('רווק/ה')
        }
        else if (inputRelationStatusEnglish === 'In a Relationship')
        {
            setFormattedRelation('בזוגיות')
        }
        else if (inputRelationStatusEnglish === 'Married')
        {
            setFormattedRelation('נשוי')
        }
      
        return formattedRelation;
    }

    useEffect(() => {
        const profilePage = async () => {

            setShowSkeleton(true); // Show skeleton animation - didnt do it yet
    
            let data;

            // Checks if user visiting other profile
            if(profileEmail) {
                data = {
                    "Email" : profileEmail,
                    "UserEmail": getAuthenticatedUser()
                }
                // Checks if both users are friends with each other
                const isFriendCheck = await checkFriend(data);
                console.log(isFriendCheck)
                if (isFriendCheck && isFriendCheck.res) {
                    setIsFriends(true)
                    
                }
                else {
                    setIsFriends(false)
                    // users arent friends
                }
                
            }
            else {
                data = {
                    "Email" : getAuthenticatedUser()
                }
            }

            if(getAuthenticatedUser()) {

                // gets the number of friends a user have
                let friendsData = {
                    "Email" : getAuthenticatedUser(),
                    "FriendsEmail" : profileEmail,
                    "Program": '0'
                }
                const numberOfFriendsResponse = await hasFriendsAtAll(friendsData)
                console.log(numberOfFriendsResponse, 'now1')
                if (numberOfFriendsResponse && numberOfFriendsResponse.res===true) {
                    setIsFriendsNumber(numberOfFriendsResponse.friendsLengthNumber)
                }
                else {
                    setIsFriendsNumber(numberOfFriendsResponse.friendsLengthNumber)
                }

                // Profile info
                const response = await profile(data)
                if(response && response.res===true) { 
                    setProfileinfo(response.data);
                       
                    formatDate(profileInfo.birthday); // Set the formatted date

                    formatRelationship(profileInfo.relationshipstatus); // Set the formatted relationship
                    
                    setShowSkeleton(false);
                    
                }
                else {
                    console.log('Somthing went wrong')
                }
            }

        }
    
        profilePage();
    
    }, [profileInfo.birthday, profileInfo.relationshipstatus])


    useEffect(() => {
        
        const imgReceiver = async () => {

            let data;

            if(profileEmail) {
                data = {
                    "Email" : profileEmail
                }
            }
            else {
                data = {
                    "Email" : getAuthenticatedUser()
                }
            }
            

            const response = await getProfileImage(data)
          
            if(response && response.res===true) { // If the response is true, update user image
                setImgProfile(response.data.userimage)
            }
            else {
                console.log(imgProfile)
            }

        }

        if(localStorage.getItem('UserInfo')) {
            imgReceiver();
        }
    }, [imgProfileTrigger])


    useEffect(() => {
        
        const getIsPendingFriend = async () => {

            const data = {
                "Email" : getAuthenticatedUser(),
                "friendEmail" : profileEmail
            }
        
            const response = await getPendingFriend(data);
          
            if(response && response.res===true && response.pending===true) { // If the response is true, update user image
                setFriendPending(true)
            }
        
        }

        if(localStorage.getItem('UserInfo') && profileEmail) {
            getIsPendingFriend();
        }
    }, [])

    const activateUploadImage = () => {
        const imageUploader = document.getElementById('imgUpload');

        if(imageUploader) {
            imageUploader.click()
        }
    }

    const activateDeleteImage = async () => {

        let data = {
            "Email" : getAuthenticatedUser(), 
        }

        const response = await deleteProfileImage(data); // sends to back request to delete profile image from db
        if (response.res === true) {
            setImgProfile(null)
        }

    }

    const imgUploader = async () => {

        // Get the selected image file
        const imageFile = document.getElementById('imgUpload')['files'][0];


        let form = new FormData();
        form.append('image', imageFile)
        
        const response = await profileImgbb(form); // sends image to img bb

        let data = {
            "Email" : getAuthenticatedUser(), 
            "UploadedImage" : response.data.display_url
        }

       await uploadImage(data);

        // Set trigger
        setImgProfileTrigger(true)

    }

    const friendRequest = async () => {
        let data = {
            "Email" : getAuthenticatedUser(), 
            "FriendEmail": profileEmail
        }

        const response = await startFriendRequest(data);
        if (response && response.res===true) {
            setFriendPending(true)
            console.log(friendPending, 'herefriend')
            // Sends a friend request
        }

    }

    const toDisplayFriends = () => {
        setIsDisplayFriends(true)
    }

    const deleteFriend = async () => {
        let data = {
            "Email": getAuthenticatedUser(),
            "FriendEmail": profileEmail
        }

        const deleteFriendResponse = await deleteFriendRequest(data)
        console.log(deleteFriendResponse)
        
    }

    return (
        <div className='profile-wrapper'>
            
            <div className='profile-wrapper-basics'>

                    <div className='sub-profile-image-wrapper'>
                        {imgProfile ? (
                            <div className='profile-sub-sub-image-wrapper'>
                                <img src={imgProfile} className='profile-user-image'></img>
                                <input type="file" id="imgUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update'/> 
                                
                                {!profileEmail && (
                                    <button className='profile-user-edit-image' onClick={activateUploadImage}> <MdOutlineModeEditOutline /> </button>
                                )}

                                {!profileEmail && (
                                    <button className='profile-user-delete-image' onClick={activateDeleteImage}> <MdDeleteForever /> </button>
                                )}
                            </div>

                        ) :(
                            <div>
                                <div className='profile-img-wrapper'>
                                    <input type="file" id="imgUpload" accept="image/jpeg, image/png, image/jpg" onChange={imgUploader} className='profile-file-update'/> 
                                    
                                    {!profileEmail && (
                                        <button className='profile-upload-img-wrapper' onClick={activateUploadImage}> <img src={plusIcon} className="profile-upload-img" /> </button>
                                    )}

                                    <LiaUserCircleSolid className='profile-user-no-image'/>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className='sub-profile-basics-wrapper'>
                        <div className='sub-sub-profile-basics'>
                        
                        {profileInfo.firstname && (
                            <div className='profile-fullname-wrapper'>
                                {profileInfo.firstname.length > 0 && (
                                    <div className='profile-fullname-text'>
                                        <span>
                                            {profileInfo.firstname}
                                        </span>
                                        <span>
                                            {profileInfo.lastname}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>

                        <div className='sub-sub-profile-basics'>
                            <span>חברים </span>  {/* number of friends */}
                            <button className='profile-friendsnumber-button' onClick={toDisplayFriends}> {friendsNumber} </button>
                        </div>
                    </div>
                    
                    {!profileEmail ? (
                        <div className='sub-profile-basics'>
                            <button onClick={() => {setIsEditProfile(true)}} className='sub-profile-edit-button'> עריכת פרופיל </button>
                        </div>
                    ) : (
                        <>
                        { !isFriends ? (
                            <div className='sub-profile-basics'>
                                {!friendPending ? (
                                    <button onClick={friendRequest} className='sub-profile-friends-button'>הוספת חבר</button>

                                ) : (
                                    <button className='sub-profile-friends-button'>ממתין לאישור...</button>
                                )}
                            </div> 
                        ) : (
                            <div className='sub-profile-basics sub-profile-friends-wrapper'>
                                <button className='sub-profile-already-friends-button'>חברים</button> {/* onclick needs to open option to unfriend */}
                                <button onClick={deleteFriend} className='sub-profile-already-friends-button sub-profile-delete-friend-wrapper'><MdDeleteForever className='sub-profile-delete-friend-button'/></button>
                            </div>
                        )}

                        </>
                    )}
            </div>

            <div className='profile-center-wrapper'>
                
                <div className='profile-center-left-wrapper'>
                    <PostUpload profileEmail={profileEmail} />
                </div>

                <div className='profile-center-right-wrapper'>
                    <div className='profile-center-right-sub-wrapper'>
                        <span className='profile-center-right-inshortcut'> בקצרה </span>

                        {profileInfo.biography && (
                            <div className='profile-biography-wrapper'>
                                {profileInfo.biography.length > 0 && (
                                    <div className='profile-biography-text'>
                                        {profileInfo.biography}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className='profile-details-wrapper'>
                                
                            {profileInfo.username && (
                                <div className='profile-inner-details-wrapper'>

                                    {profileInfo.occupation && profileInfo.occupation.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={workIcon} />
                                            <div className='profile-details-text'>
                                                <span>עובד/ת ב- </span> {profileInfo.occupation}
                                            </div>
                                        </div>
                                        
                                    )}

                                    {profileInfo.school && profileInfo.school.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={schoolIcon} />
                                            <div className='profile-details-text'>
                                            <span>למד/ה ב-</span> {profileInfo.school}
                                            </div>
                                        </div>
                                    )}

                                    {profileInfo.address && profileInfo.address.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={locationIcon} />
                                            <div className='profile-details-text'>
                                                <span>גר/ה ב- </span>{profileInfo.address}
                                            </div>
                                        </div>
                                    )}

                                    {profileInfo.relationshipstatus && profileInfo.relationshipstatus.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={heartIcon} />
                                            <div className='profile-details-text'>
                                                {formattedRelation}      
                                            </div>                              
                                        </div>
                                    )}

                                    {profileInfo.birthday && profileInfo.birthday.length > 0 && (
                                        <div className='profile-details'>
                                            <img className='profile-details-icons' src={birthIcon} />
                                            <div className='profile-details-text'>
                                                <span>נולד/ה בתאריך </span>{formattedDate} 
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )} 

                        </div>
                    </div>
                </div>

            </div>

            {/* Update Profile Form */}
            {isEditProfile && (
                <div className='profile-update-profile-wrapper-wrapper'>
                    <SetProfile isUpdateProfile={isEditProfile} setIsEditProfile={setIsEditProfile}/>
                </div>
            )}

            {isDisplayFriends && (
                    <div className='marketplace-left-productupload-wrapper'>
                        <DisplayFriends setIsDisplayFriends={setIsDisplayFriends} />
                    </div>
                )}

        </div>
    );
}

export default Profile;