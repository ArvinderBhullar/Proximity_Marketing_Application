import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import {  signOut } from "firebase/auth";
import {BrowserRouter as Router, NavLink, Route, Routes, useNavigate} from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
                console.log("uid", uid)
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
                navigate("/login");
            }
        });
    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/login");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return(
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Dashboard</div>
            </div>
            <br/>
            <nav>
                <div>
                    <NavLink to="/addorganization">Add Organization</NavLink>
                </div>
                <br/>
                <div>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Home;
