import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByJWqT8nYlkX0kgBqpyF4RRwPREVbSHc8",
  authDomain: "fast-project-c8076.firebaseapp.com",
  projectId: "fast-project-c8076",
  storageBucket: "fast-project-c8076.firebasestorage.app",
  messagingSenderId: "832130335164",
  appId: "1:832130335164:web:a315d7425926116d12ebb9",
  measurementId: "G-HZM4S2C7FC"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
