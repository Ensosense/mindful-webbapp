import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "mindful-ai-guru-b553b.firebaseapp.com",
  projectId: "mindful-ai-guru-b553b",
  storageBucket: "mindful-ai-guru-b553b.appspot.com",
  messagingSenderId: "150727218293",
  appId: "1:150727218293:web:9c3c0e7b2a2be7c06c143c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };