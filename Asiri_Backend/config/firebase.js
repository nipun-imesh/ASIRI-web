// config/firebase.js (Alternative - using compat version)
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");
require("firebase/compat/auth");

const firebaseConfig = {
    apiKey: "AIzaSyBv6Hz4NCjHocN0_nZrszW67saPpwrYqwQ",
    authDomain: "asiri-health-app.firebaseapp.com",
    databaseURL: "https://asiri-health-app-default-rtdb.firebaseio.com",
    projectId: "asiri-health-app",
    storageBucket: "asiri-health-app.firebasestorage.app",
    messagingSenderId: "164935138431",
    appId: "1:164935138431:web:a73f2647e1911d4e4d534a",
    measurementId: "G-ZVWKLFTDPB"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore Database (compat version)
const db = firebase.firestore();

// Initialize Authentication (compat version)
const auth = firebase.auth();

console.log('✅ Firebase initialized successfully (Firestore & Auth ready)');

module.exports = { app, db, auth };