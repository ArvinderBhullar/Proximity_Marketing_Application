import React, {useState, useEffect} from 'react';
import Home from './page/Home';
import Register from './page/Register';
import Login from './page/Login';
import FloorPlan from "./page/FloorPlan";
import AddOrganization from "./page/AddOrganization";
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import './App.css'
import Navbar from "./components/Navbar";
function App() {
    return (
        <div className="app">
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/floorplan" element={<FloorPlan />}/>
                    <Route path="/addorganization" element={<AddOrganization />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
