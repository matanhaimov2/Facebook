import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';

// Main CSS
import './App.css';

// Pages
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';
import SetProfile from './Pages/SetProfile/setprofile';
import Profile from './Pages/Profile/profile';
import Marketplace from './Pages/Marketplace/marketplace';

// Components
import TopNav from './Components/Topnav/topnav';

// Service
import { healthCheck } from './Services/administrationService';
import { isAuthenticated } from './Services/authService';

// --- Functions
function login() {
  return <Login />;
}

function register() {
  return <Register />;
}

function home() {
  return <Home />;
}

function setprofile() {
  return <SetProfile />
}

function profile() {
  return <Profile />
}

function marketplace() {
  return <Marketplace />
}

// For Pages that are private
const PrivateRoutes = () => {


  // For Components that are also private and with nav
  const ComponentsWithNav = () => {
    return (
      <div className='com-with-nav-wrapper'>

        <div className='com-with-nav'>
          <TopNav />
        </div>

        <div className='com-with-nav-item'>
          <Routes>
            <Route path="/home" element={ home() } />
            <Route path="/profile" element={ profile() } />
            <Route path="/profile/:profileEmail" element={ profile() } />
            <Route path="/marketplace" element={ marketplace() } /> {/* ask shlomi whats an element */}
            <Route path="/marketplace/:categoryTitle" element={ marketplace() } /> 


            
            {/* Page Doesnt Exists */}
            <Route path='/*' element={ <div>404 doesnt exists</div> } />
          </Routes>
        </div>
      </div>
    );
  }

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() =>{
    const checkAuthentication = async () => {
      setIsLoggedIn(await isAuthenticated())
    }
    
    checkAuthentication()
  })

  return (
    <div className='private-routes'>
      {isLoggedIn ? (
        <Routes>

          <Route path="/setprofile" element={ setprofile() } />
          
          {/* Routes With Navigation Bar  */}
          <Route path="/*" element={ <ComponentsWithNav /> } />

        </Routes>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};


function App() {

  useEffect(() => {
    const healthChecker = async () => {
      let res = await healthCheck();
     
      if(!res && window.location.pathname !== '/sitenotfound') {
        window.location.href = '/sitenotfound';
      }
    }

    // Call Health Checker to see if back is alive
    healthChecker();
  }, [])

  return (
    <div className="outer-wrapper">
        <div className='wrapper'>
            <Router>

                <Routes>
                    <Route path='/login' element={ login() } />
                    <Route path='/register' element={ register() } />

                    <Route path='/sitenotfound' element={<div>site is under constarction</div>}/>

                    {/* Private Routes */}
                    <Route path='/*' element={ <PrivateRoutes /> } />
          
                </Routes>

            </Router>
        </div>
    </div>
  );
}

export default App;
