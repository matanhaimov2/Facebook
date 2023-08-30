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



export {
    login,

}