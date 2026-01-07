import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhVm_dkacoYbBxqLujJq5yo9mkojhMlB4",
  authDomain: "dashboard-ab571.firebaseapp.com",
  databaseURL: "https://dashboard-ab571-default-rtdb.firebaseio.com",
  projectId: "dashboard-ab571",
  storageBucket: "dashboard-ab571.firebasestorage.app",
  messagingSenderId: "966372132616",
  appId: "1:966372132616:web:65d940f2ff338186d3cebd",
  measurementId: "G-4DGQPXEDRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database: Database = getDatabase(app);

// Sign in anonymously on app load
export const initAuth = async (): Promise<string> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (error) {
    console.error('Error during anonymous authentication:', error);
    throw error;
  }
};

export default app;
