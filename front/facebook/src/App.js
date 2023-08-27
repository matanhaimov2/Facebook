import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Main CSS
import './App.css';

// Pages
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';


// Functions
function login() {
  return <Login />;
}

function register() {
  return <Register />;
}

function home() {
  return <Home />;
}

function App() {
  return (
    <div className="outer-wrapper">
        <div className='wrapper'>
            <Router>
                <Routes>
                    <Route path='/login' element={ login() } />
                    <Route path='/register' element={ register() } />
                    <Route path='/home' element={ home() } />
                </Routes>
            </Router>
        </div>
    </div>
  );
}

export default App;
