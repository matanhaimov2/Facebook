import React, { useState, useEffect } from 'react';


//CSS
import './home.css';

// Components
import Feed from "../../Components/Feed/feed";
import OnlineFriends from "../../Components/OnlineFriends/onlinefriends";



function Home() {

    // States

    return (
        <div className='home-wrapper'>
            <div className='home-left-wrapper'>
                <OnlineFriends />
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