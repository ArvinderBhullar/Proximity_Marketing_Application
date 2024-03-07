import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import {onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";

const AddOrganization = () => {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState('');
    const [storeCreationError, setStoreCreationError] = useState('');

    const onRegister = (e) => {
        e.preventDefault();
        // signInWithEmailAndPassword(auth, email, password)
        //     .then((userCredential) => {
        //         // Signed in
        //         const user = userCredential.user;
        //         navigate("/")
        //         console.log(user);
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         console.log(errorCode, errorMessage);
        //         setloginError(errorMessage);
        //     });
    }

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
                <div>Add Organization</div>
            </div>
            <br/>
            <div className={'inputContainer'}>
                <input
                    id="storeName"
                    name="storeName"
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    placeholder="Store Name"
                    className={'inputBox'}
                />
            </div>
            <br/>
            <label className={'errorLabel'}>
                {storeCreationError}
            </label>
            <br/>
            <button
                onClick={onRegister}
                className={'buttonContainer'}
            >
                Register Organization
            </button>
        </div>
    )
}

export default AddOrganization;
