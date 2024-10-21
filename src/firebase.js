
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';




const firebaseConfig = {
  apiKey: "AIzaSyC8Ih1y7b_hFW3JKPG-3OYd4m97-8wIclc",
  authDomain: "fnproject-bc2de.firebaseapp.com",
  projectId: "fnproject-bc2de",
  storageBucket: "fnproject-bc2de.appspot.com",
  messagingSenderId: "92219368948",
  appId: "1:92219368948:web:5c9d5158d66dbcbbcec5a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth,db, firestore };