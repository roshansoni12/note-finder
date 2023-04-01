import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAq6xtfB01wIkWMdEbqsI_ShllNa5Q-yNs",
  authDomain: "notefinder-531b0.firebaseapp.com",
  projectId: "notefinder-531b0",
  storageBucket: "notefinder-531b0.appspot.com",
  messagingSenderId: "1011007473953",
  appId: "1:1011007473953:web:37b8a7cfae8e5eb6381660",
  measurementId: "G-DES59RKKVJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
