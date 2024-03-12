// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyA9DXCmR0R9bKnZ4f5Gi6f8x9weU88j2Aw",
    authDomain: "closetify-f83ec.firebaseapp.com",
    projectId: "closetify-f83ec",
    storageBucket: "closetify-f83ec.appspot.com",
    messagingSenderId: "60271493425",
    appId: "1:60271493425:web:135d3df898890c88787010",
    databaseURL: "https://closetify-f83ec-default-rtdb.firebaseio.com",
    measurementId: "G-F4QSXE9W94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default auth;

