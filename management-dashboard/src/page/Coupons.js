import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import {onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import {db} from "../firebase";
// import { collection, addDoc } from "firebase/firestore";
import {doc, getDoc, setDoc} from "firebase/firestore";
// import { getDatabase, ref, set } from "firebase/database";

const Coupons = () => {
    const navigate = useNavigate();
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [storeCreationError, setStoreCreationError] = useState('');
    // const database = getDatabase();
    const [uid, setuid] = useState('');

    const initialCoupons = [
        {
            id: 1,
            name: 'Coupon 1',
            description: 'Lorem ipsum dolor sit amet.',
            beginDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        {
            id: 2,
            name: 'Coupon 2',
            description: 'Lorem ipsum dolor sit amet.',
            beginDate: '2022-01-01',
            endDate: '2022-12-31',
        },
    ];
    const [coupons, setCoupons] = useState(initialCoupons);
    const renderCoupons = () => {
        return coupons.map((coupon) => (
            <li key={coupon.id} className="coupon-item">
                <div onClick={() => handleEditCoupon(coupon)}>
                    <div className="coupon-title">{coupon.name}</div>
                    <div>Description: {coupon.description}</div>
                    <div>Begin Date: {coupon.beginDate}</div>
                    <div>End Date: {coupon.endDate}</div>
                </div>
            </li>
        ));
    };

    const handleEditCoupon = (coupon) => {
        // You can implement the logic to open the pop-up for editing with the selected coupon data
        // Example: setEditCoupon(coupon); openPopup();
        alert('Coupon clicked 👍' );
    };

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
                setStoreAddress(organizationData.storeAddress);
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

    const onRegister = async (e) => {
        e.preventDefault();
        console.log(storeName);

        const data = {
            storeName: storeName,
            storeAddress: storeAddress,
        };
        setDoc(doc(db, "Organization", uid), data).
            then(() => {
                alert('Organization created/updated 👍' );
                navigate("/");
            })
            .catch((error) => {
                // alert(error.message);
                setStoreCreationError(error.message);
            });
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setuid(user.uid);
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

    return(
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Add/Edit Coupons</div>
            </div>
            <br/>
            <ul className="coupon-list">
                {renderCoupons()}
            </ul>
            <br/>
            <button
                onClick={onRegister}
                className={'buttonContainer'}
            >
                Add Coupons
            </button>
            <div className={'inputContainer'}>
                <input
                    id="storeName"
                    name="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    placeholder="Store Name"
                    className={'inputBox'}
                />
            </div>
            <br/>
            <div className={'inputContainer'}>
                <input
                    id="storeAddress"
                    name="storeAddress"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    required
                    placeholder="Store Address"
                    className={'inputBox'}
                />
            </div>
            <br/>
            <label className={'errorLabel'}>
                {storeCreationError}
            </label>
            <br/>
        </div>
    )
}

export default Coupons;
