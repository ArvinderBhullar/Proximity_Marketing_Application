import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import {  signOut } from "firebase/auth";
import {BrowserRouter as Router, NavLink, Route, Routes, useNavigate} from 'react-router-dom';
import {db} from "../firebase";
import {doc, getDoc} from "firebase/firestore";

const Home = () => {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState('Please add an Organization to manage.');
    // const {uid} = auth.currentUser;
    // const [uid, setuid] = useState('');

    const readOrganizationData = async (uid) => {

        try {
            if (!uid) {
                console.log("UID not available");
                return;
            }
            const docRef = doc(db, "Organization", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // Document exists, you can access the data
                const organizationData = docSnap.data();
                setStoreName(organizationData.storeName);
                console.log("Organization Data:", organizationData);
                // return organizationData;
            } else {
                console.log("Organization not found");
                // return null;
            }
        } catch (error) {
            console.error("Error reading organization data:", error.message);
            // throw error;
        }
    };

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // setuid(user.uid);
                readOrganizationData(user.uid);
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                // const uid = user.uid;
                // console.log("uid", uid)
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
                navigate("/login");
            }
        });
        return () => {
            // Cleanup the subscription when the component is unmounted
            unsubscribe();
        };
    }, [navigate])

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
                <div>{storeName}</div>
            </div>
            <br/>
            <nav>
                <div>
                    <NavLink to="/addorganization">Add/Edit Organization</NavLink>
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
