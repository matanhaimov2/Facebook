import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions


// -- Authentication
const login = async (data) => {
    try {
        // Sends to back email and password to see if correct
        const response = await axios.post(SERVER_URL + "/login", data)
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const register = async (data) => {
    try {
        // Sends to back the data to insert db
        const response = await axios.post(SERVER_URL + "/register", data)
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

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

const signout = async (data) => {
    
}



export {
    login,
    register,
    setprofile,
    signout
}