import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";

const FloorPlan = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
            } else {
                // User is signed out
                navigate("/login");
            }
        });
    }, [])

    return(
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Floorplan</div>
            </div>
        </div>
    )
}

export default FloorPlan;

