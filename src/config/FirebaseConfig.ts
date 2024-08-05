// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Capacitor } from "@capacitor/core";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  authDomain: "bookevents-5bd5d.firebaseapp.com",
  projectId: "bookevents-5bd5d",
  storageBucket: "bookevents-5bd5d.appspot.com",
  messagingSenderId: "1067941211108",
  appId: "1:1067941211108:web:987487d94becb80da235f1",
};

// Initialize Firebase
const FB = initializeApp(firebaseConfig);
const db = getFirestore(FB);
const storage = getStorage(FB);
const auth = getAuth(FB);

export { FB, auth, db, storage };
