// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9DXCmR0R9bKnZ4f5Gi6f8x9weU88j2Aw",
  authDomain: "closetify-f83ec.firebaseapp.com",
  projectId: "closetify-f83ec",
  storageBucket: "closetify-f83ec.appspot.com",
  messagingSenderId: "60271493425",
  appId: "1:60271493425:web:135d3df898890c88787010",
  measurementId: "G-F4QSXE9W94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize firestore
const db = getFirestore(app);

// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {db, app, auth, firebaseConfig};
