import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions


// -- Authentication

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



export {
    setprofile,
    profile
}