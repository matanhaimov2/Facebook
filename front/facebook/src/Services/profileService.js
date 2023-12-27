import axios from "axios";

// Global Veribales
import { SERVER_URL, IMAGE_BB_key } from "../Assets/GlobalVeriables";



// --- API Functions

const setprofile = async (data) => {
    try {
        // Sends to back additional data about the user to insert db
        const response = await axios.post(SERVER_URL + "/setprofile", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const profile = async (data) => {
    try {
        // Sends to back additional data about the user to insert db
        const response = await axios.post(SERVER_URL + "/profile", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const profileImgbb = async (data) => {
    try {
        // Sends to img bb a profile image
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMAGE_BB_key}`, data)
        console.log(response.data);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const uploadImage = async (data) => {
    try {
        // Sends to back profile image to insert db
        const response = await axios.post(SERVER_URL + "/uploadimage", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const getProfileImage = async (data) => {
    try {
        // Get profile image from back from db 
        const response = await axios.post(SERVER_URL + "/getProfileImage", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const deleteProfileImage = async (data) => {
    try {
        // Sends to back request to delete profile image from db
        const response = await axios.post(SERVER_URL + "/deleteProfileImage", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const uploadPost = async (data) => {
    try {
        // Sends to back post to insert db
        const response = await axios.post(SERVER_URL + "/uploadPost", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const getProfilePost = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/getProfilePost", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}



const acceptFriend = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/acceptFriend", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const ignoreFriend = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/ignoreFriend", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const checkFriend = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/checkFriend", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const deleteFriendRequest = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/deleteFriendRequest", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


const startFriendRequest = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/startFriendRequest", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const newNotifications = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/newNotifications", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const hasFriendsAtAll = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/hasFriendsAtAll", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const getPendingFriend = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/isFriendPending", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const oneFriendRequestCheck = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/oneFriendRequestCheck", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


export {
    setprofile,
    profile,
    profileImgbb,
    uploadImage,
    getProfileImage,
    deleteProfileImage,
    uploadPost,
    getProfilePost,
    acceptFriend,
    checkFriend,
    hasFriendsAtAll, 
    startFriendRequest,
    newNotifications, 
    deleteFriendRequest,
    ignoreFriend,
    getPendingFriend,
    oneFriendRequestCheck

}