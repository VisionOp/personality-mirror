import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7I0oROEPio0Fp-ZWY4mLywdioA0NCy-Q",
  authDomain: "personality-mirror.firebaseapp.com",
  projectId: "personality-mirror",
  storageBucket: "personality-mirror.firebasestorage.app",
  messagingSenderId: "17811787753",
  appId: "1:17811787753:web:71877c0d8071f0eef6c578",
  measurementId: "G-TTWBKEV9W6"
};
// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
