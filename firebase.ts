// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA28cwOqUn-7Ugzd52dvuCzJwwqFJiMcdY",
  authDomain: "metaismk.firebaseapp.com",
  databaseURL: "https://metaismk-default-rtdb.firebaseio.com",
  projectId: "metaismk",
  storageBucket: "metaismk.appspot.com",
  messagingSenderId: "535665248462",
  appId: "1:535665248462:web:5fd583a560528f601ba89f",
  measurementId: "G-MRE1QLRQJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
