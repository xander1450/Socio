import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyA6nIm5sBI8tjFnqbaMvwvXKhp-k-jO_9k",
  authDomain: "socio-f0c17.firebaseapp.com",
  projectId: "socio-f0c17",
  storageBucket: "socio-f0c17.firebasestorage.app",
  messagingSenderId: "764721526562",
  appId: "1:764721526562:web:8f654ccec6d60967db177b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
