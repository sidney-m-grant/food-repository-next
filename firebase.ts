
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAmRy5QgdTHXPq0fhHHuY6xCKgLF58T5WE",
  authDomain: "food-respository-next.firebaseapp.com",
  projectId: "food-respository-next",
  storageBucket: "food-respository-next.appspot.com",
  messagingSenderId: "836788145185",
  appId: "1:836788145185:web:cc52406b4b0d8ed8156760"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)