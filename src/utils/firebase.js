// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7XCOoJguiVDtXETNmMygzM4VfvdB0PEE",
  authDomain: "netflixc-74e8e.firebaseapp.com",
  projectId: "netflixc-74e8e",
  storageBucket: "netflixc-74e8e.firebasestorage.app",
  messagingSenderId: "980709075317",
  appId: "1:980709075317:web:4aa59ecb6ef07612834b3c",
  measurementId: "G-2T4WZKK39J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();