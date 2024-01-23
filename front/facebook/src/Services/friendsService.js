import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions

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

const getAllUsersFromFriendsDB = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/getAllUsersFromFriendsDB", data)
        
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

const friendsStatus = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/friendsStatus", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


export {
    acceptFriend,
    checkFriend,
    hasFriendsAtAll, 
    getAllUsersFromFriendsDB,
    startFriendRequest,
    deleteFriendRequest,
    ignoreFriend,
    getPendingFriend,
    oneFriendRequestCheck,
    friendsStatus

}