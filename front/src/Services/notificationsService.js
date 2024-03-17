import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions

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


export {
    newNotifications
}