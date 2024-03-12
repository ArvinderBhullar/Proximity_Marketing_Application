import React, { useState, useEffect } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Appbar from "./components/Appbar";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Coupons from "./pages/Coupons";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <div>
      <Appbar />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/map"
            element={
              <PrivateRoute>            
                <Map />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>            
                <Home />
              </PrivateRoute>
            }
          />
           <Route
            path="/coupons"
            element={
              <PrivateRoute>            
                <Coupons />
              </PrivateRoute>
            }
          />
         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
