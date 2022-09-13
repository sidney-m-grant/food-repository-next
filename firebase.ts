// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmRy5QgdTHXPq0fhHHuY6xCKgLF58T5WE",
  authDomain: "food-respository-next.firebaseapp.com",
  projectId: "food-respository-next",
  storageBucket: "food-respository-next.appspot.com",
  messagingSenderId: "836788145185",
  appId: "1:836788145185:web:cc52406b4b0d8ed8156760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)