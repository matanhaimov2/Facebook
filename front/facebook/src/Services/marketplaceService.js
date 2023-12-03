import axios from "axios";

// Global Veribales
import { SERVER_URL, IMAGE_BB_key } from "../Assets/GlobalVeriables";



// --- API Functions

const getSpecificProduct = async (data) => {
    try {
        // Sends to back product to insert db
        const response = await axios.post(SERVER_URL + "/getSpecificProduct", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const getAllProduct = async (data) => {
    try {
        // Sends to back product to insert db
        const response = await axios.post(SERVER_URL + "/getAllProduct", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

export {
    getSpecificProduct,
    getAllProduct
}