import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import {onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import {db} from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
// import { getDatabase, ref, set } from "firebase/database";

const AddOrganization = () => {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState('');
    const [storeCreationError, setStoreCreationError] = useState('');
    // const database = getDatabase();
    const {uid} = auth.currentUser;

    // async function add_dummy() {
    //     const res = await database.collection('cities').add({
    //         name: 'Tokyo',
    //         country: 'Japan'
    //     });
    //
    //     console.log('Added document with ID: ', res.id);
    // }

    const onRegister = async (e) => {
        e.preventDefault();
        console.log(storeName);

        const data = {
            storeName: storeName,
        };
        await setDoc(doc(db, "Organization", uid), data);

        // addDoc(collection(db, "cities"), {
        //     name: 'Los Angeles',
        //     state: 'CA',
        //     country: 'USA'
        // })
        //     .then(() => {
        //         alert('Message submitted 👍' );
        //     })
        //     .catch((error) => {
        //         alert(error.message);
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
