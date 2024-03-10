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
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const initialCoupons = [
        {
            id: 1,
            name: 'SHALMART',
            description: '20% off on beans!',
            beginDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        {
            id: 2,
            name: 'SHALMART',
            description: 'Buy one get one 50% off!',
            beginDate: '2022-01-01',
            endDate: '2022-12-31',
        },
    ];
    const [coupons, setCoupons] = useState(initialCoupons);
    const renderCoupons = () => {
        return coupons.map((coupon) => (
            <li key={coupon.id} className="coupon-item">
                <div onClick={() => handleEditCoupon(coupon)}>
                    <br/>
                    <div className="coupon-title">{coupon.name}</div>
                    <br/>
                    <div className="coupon-description">{coupon.description}</div>
                    <br/>
                    <div className="coupon-date">Expires: {coupon.endDate}</div>
                    <br/>
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

    const onAddCoupon = async (e) => {
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
            <button
                onClick={onAddCoupon}
                className={'buttonContainer'}
            >
                Add Coupons
            </button>
            <br/>
            <ul className="coupon-list">
                {renderCoupons()}
            </ul>
            <br/>
            <button className="add-coupon-button" onClick={openPopup}>
                Add Coupon
            </button>
            {/* Popup Window */}
            {showPopup && (
                <div className="overlay">
                <div id="popup" className="popup-container">
                    <div>
                        {/* Form for adding a new coupon */}
                        <h2>Add Coupon</h2>
                        <form id="addCouponForm">
                            {/* Input fields for Coupon details (name, description, begin date, end date) go here */}
                            <label htmlFor="couponName">Coupon Name:</label>
                            <input type="text" id="couponName" name="couponName" required/>
                            <br/>
                            <br/>
                            <label htmlFor="couponDescription">Description:</label>
                            <textarea id="couponDescription" name="couponDescription" required></textarea>
                            <br/>
                            <br/>
                            <label htmlFor="beginDate">Begin Date:</label>
                            <input type="date" id="beginDate" name="beginDate" required/>
                            <br/>
                            <br/>
                            <label htmlFor="endDate">End Date:</label>
                            <input type="date" id="endDate" name="endDate" required/>
                            <br/>
                            <br/>
                            <button type="submit">Save Coupon</button>
                        </form>

                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
                </div>
            )}

            {/*<div className={'inputContainer'}>*/}
            {/*    <input*/}
            {/*        id="storeName"*/}
            {/*        name="storeName"*/}
            {/*        value={storeName}*/}
            {/*        onChange={(e) => setStoreName(e.target.value)}*/}
            {/*        required*/}
            {/*        placeholder="Store Name"*/}
            {/*        className={'inputBox'}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<div className={'inputContainer'}>*/}
            {/*    <input*/}
            {/*        id="storeAddress"*/}
            {/*        name="storeAddress"*/}
            {/*        value={storeAddress}*/}
            {/*        onChange={(e) => setStoreAddress(e.target.value)}*/}
            {/*        required*/}
            {/*        placeholder="Store Address"*/}
            {/*        className={'inputBox'}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<label className={'errorLabel'}>*/}
            {/*    {storeCreationError}*/}
            {/*</label>*/}
            <br/>
        </div>
    )
}

export default Coupons;
