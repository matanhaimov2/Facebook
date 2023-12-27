import React, { useState, useEffect } from 'react';


//CSS
import './home.css';

// Components
import  Feed from "../../Components/Feed/feed";


function Home() {

    // States

    return (
        <div className='home-wrapper'>
            <div className='home-left-wrapper'>

            </div>

            <div className='home-center-wrapper'>
                <Feed />
            </div>

            <div className='home-right-wrapper'>
            
            </div>
        </div>
    );
}

export default Home;