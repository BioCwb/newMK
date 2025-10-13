// Fix: Use firebase/compat imports for v8 compatibility to resolve missing export errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import { getDatabase } from 'firebase/database';

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
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Export v9 database instance for consistent use across the app
export const database = getDatabase(app);

// Keep v8 compat for storage and auth, as they are not causing issues.
export const storage = firebase.storage();
export const auth = firebase.auth();
export { firebase, app }; // Export firebase namespace for types like firebase.User