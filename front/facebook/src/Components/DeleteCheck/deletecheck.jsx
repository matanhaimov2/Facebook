import React, { useState, useEffect } from 'react';

// Icons

// React Icons 


// CSS
import './deletecheck.css';

// Services
import { deleteProductRequest } from '../../Services/marketplaceService';
import { getAuthenticatedUser } from '../../Services/authService';


const DeleteCheck = ({ setExtendDeleteCheck }) => {

    const deleteProduct = async () => {
        let data;
    
        data = {
            "Email" : getAuthenticatedUser(),
            "Index" : localStorage.getItem('productIndex')
        }
    
        console.log(data)
    
        const delete_response = await deleteProductRequest(data) 
        if(delete_response && delete_response.res===true) {
    
            window.location.href = '/marketplace/myproducts';
            localStorage.removeItem('productIndex')
        }
    }

    const dontDeleteProduct = () => {
        localStorage.removeItem('productIndex')
        setExtendDeleteCheck(false)
    
    }

    return (
        <div className='deletecheck-wrapper'>
            <div className='deletecheck-sub-wrapper'>
                <span> Are You Sure?</span>
            </div>

            <div className='deletecheck-sub-wrapperr'>
                <button className='deletecheck-yes-button' onClick={deleteProduct}> YES </button>

                <button className='deletecheck-no-button' onClick={dontDeleteProduct}> NO </button>
            </div>
            

        </div>
    );
}

export default DeleteCheck;