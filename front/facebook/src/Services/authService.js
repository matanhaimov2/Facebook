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

const handleSignOut = async (data) => {
    try {
        let userInfo = JSON.parse(localStorage.getItem("UserInfo"));
        let sessionID = userInfo['sessionID'];

        let data = {
            "sessionID": sessionID
        }

        localStorage.removeItem("UserInfo");

        // Sends to back sessionID to delete from db
        const response = await axios.post(SERVER_URL + "/handleSignOut", data)
        console.log(response);

        window.location.href='/login';

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const isAuthenticated = async () => {
    try {
        const data = localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : null;
        
        if(data) {
            const UserData = {
                'email' : data.email,
                'sessionID' : data.sessionID
            }

            // Sends to back the data to insert db
            const response = await axios.post(SERVER_URL + "/isAuthenticated", UserData)

            if(response && response.data) {
                return response.data.res
            }
        }
        else {
            return false
        }
       
    }
    catch (err) {
        console.log(err);
    }
}

const getAuthenticatedUser = () => {
    const user = localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : null;

    if(user && user.email) {
        return user.email;
    }
    else {
        return null;
    }
}



export {
    login,
    register,
    handleSignOut,
    isAuthenticated,
    getAuthenticatedUser
}