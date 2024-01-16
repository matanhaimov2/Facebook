import axios from "axios";

// Global Veribales
import { SERVER_URL, IMAGE_BB_key } from "../Assets/GlobalVeriables";



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


export {
    likePost,
}