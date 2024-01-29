// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTq0Sb7_nrx_S4tYlVTyv7Ne3u6qjrAHM",
  authDomain: "react-siroo-app.firebaseapp.com",
  projectId: "react-siroo-app",
  storageBucket: "react-siroo-app.appspot.com",
  messagingSenderId: "522455867500",
  appId: "1:522455867500:web:ec0446c44bbf05aada7849",
  measurementId: "G-85XQPCYJ9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app