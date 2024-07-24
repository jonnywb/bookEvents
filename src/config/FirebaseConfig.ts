// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACGNlbIgk_6_P5UngLpNsEkoBoaQzmBkU",
  authDomain: "bookevents-5bd5d.firebaseapp.com",
  projectId: "bookevents-5bd5d",
  storageBucket: "bookevents-5bd5d.appspot.com",
  messagingSenderId: "1067941211108",
  appId: "1:1067941211108:web:987487d94becb80da235f1",
};

// Initialize Firebase
const FB = initializeApp(firebaseConfig);

export default FB;
