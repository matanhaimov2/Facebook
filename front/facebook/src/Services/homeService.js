import axios from "axios";

// Global Veribales
import { SERVER_URL, IMAGE_BB_key } from "../Assets/GlobalVeriables";



// --- API Functions


const getPostsToFeed = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/getPostsToFeed", data)
        
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
    getPostsToFeed,
    friendsStatus
}