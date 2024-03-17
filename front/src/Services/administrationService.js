import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



// --- API Functions


// -- Health Check
const healthCheck = async (data) => {
    try {
        // Sends to back email and password to see if correct
        const response = await axios.get(SERVER_URL + "/healthCheck")
        console.log(response);

        return response.data.res
    }
    catch (err) {
        return false;
    }
}




export {
    healthCheck,
}