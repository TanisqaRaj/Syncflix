import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBESb7CZUyrT3e3bqhSJnijFDXuKVTTqcY",
  authDomain: "syncflix-d8250.firebaseapp.com",
  projectId: "syncflix-d8250",
  storageBucket: "syncflix-d8250.firebasestorage.app",
  messagingSenderId: "327655625195",
  appId: "1:327655625195:web:c29cdcce9cb348a9cd89ae",
  measurementId: "G-CWRN4T96L0",
  databaseURL:"https://syncflix-d8250-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
