// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-bk3kUmemjtV9O-42lAcgpIR2wWO4lPo",
  authDomain: "platform-8df55.firebaseapp.com",
  projectId: "platform-8df55",
  storageBucket: "platform-8df55.firebasestorage.app",
  messagingSenderId: "338093660243",
  appId: "1:338093660243:web:3159e70684e6cc7ccd4ea6",
  measurementId: "G-BTS3547GN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);