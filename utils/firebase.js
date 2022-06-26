import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkQMcKpr8XHHucnERPw80MjU4xlycJXnQ",
  authDomain: "accountbook-1af7e.firebaseapp.com",
  projectId: "accountbook-1af7e",
  storageBucket: "accountbook-1af7e.appspot.com",
  messagingSenderId: "497308745195",
  appId: "1:497308745195:web:0949c5977efff631952dae",
  measurementId: "G-4731N71XSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
