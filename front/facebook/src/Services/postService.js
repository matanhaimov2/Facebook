import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions


const likePost = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/likePost", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const commentPost = async (data) => {
    try {
        // Get post from back from db
        const response = await axios.post(SERVER_URL + "/commentPost", data)
        
        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


export {
    likePost,
    commentPost
}