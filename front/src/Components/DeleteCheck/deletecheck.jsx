import React from 'react';


// Languages
import { useTranslation } from 'react-i18next';


// CSS
import './deletecheck.css';

// Services
import { deleteProductRequest } from '../../Services/marketplaceService';
import { getAuthenticatedUser } from '../../Services/authService';


const DeleteCheck = ({ setExtendDeleteCheck, selectedOption }) => {

    
    // Translator
    const { t } = useTranslation();


    const deleteProduct = async () => {
        let data;
    
        data = {
            "Email" : getAuthenticatedUser(),
            "Index" : selectedOption 
        }
    
        const delete_response = await deleteProductRequest(data);
         
        if(delete_response && delete_response.res===true) {
    
            window.location.href = '/marketplace/myproducts';
        }
    }

    const dontDeleteProduct = () => {
        setExtendDeleteCheck(false)
    
    }

    return (
        <div className='deletecheck-wrapper'>
            <div className='deletecheck-sub-wrapper'>
                <span>{t('marketplace.deletecheck.deletecheck_are_u_sure_title')}</span>
            </div>

            <div className={`deletecheck-sub-wrapperr ${document.documentElement.getAttribute('dir')==='ltr' ? 'direction-ltr' : 'direction-rtl'}`}>
                <button className='deletecheck-yes-button' onClick={deleteProduct}> {t('marketplace.deletecheck.deletecheck_yes_title')} </button>

                <button className='deletecheck-no-button' onClick={dontDeleteProduct}> {t('marketplace.deletecheck.deletecheck_no_title')} </button>
            </div>
            

        </div>
    );
}

export default DeleteCheck;