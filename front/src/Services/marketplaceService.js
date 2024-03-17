import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";



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

const deleteProductRequest = async (data) => {
    try {
        // Sends to back product to insert db
        const response = await axios.post(SERVER_URL + "/deleteProductRequest", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const uploadProduct = async (data) => {
    try {
        // Sends to back product to insert db
        const response = await axios.post(SERVER_URL + "/uploadProduct", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const editProduct = async (data) => {
    try {
        // Sends to back product to insert db
        const response = await axios.post(SERVER_URL + "/editProduct", data)

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}


export {
    getSpecificProduct,
    getAllProduct,
    deleteProductRequest,
    uploadProduct,
    editProduct
}