import axios from "axios";

// Global Veribales
import { SERVER_URL, IMAGE_BB_key } from "../Assets/GlobalVeriables";



// --- API Functions

const setprofile = async (data) => {
    try {
        // Sends to back additional data about the user to insert db
        const response = await axios.post(SERVER_URL + "/setprofile", data)
        console.log(response);

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
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const profileImage = async (data) => {
    try {
        // Sends to image bb a profile image
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
        // Sends to back additional data about the user to insert db
        const response = await axios.post(SERVER_URL + "/uploadimage", data)
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const receiveImage = async (data) => {
    try {
        // Sends to back additional data about the user to insert db
        const response = await axios.post(SERVER_URL + "/getProfileImage", data)
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


export {
    setprofile,
    profile,
    profileImage,
    uploadImage,
    receiveImage
}