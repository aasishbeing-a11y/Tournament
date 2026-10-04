import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';

export const loginAdmin = async (email, password) => {
  const cleanEmail = email.trim();
  const configuredAdmin = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();

  try {
    const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const userEmail = (result.user.email || '').toLowerCase();

    // If an admin email is configured in .env, verify it matches
    if (configuredAdmin && userEmail !== configuredAdmin) {
      await signOut(auth);
      throw new Error(`Unauthorized: ${userEmail} is not the configured admin email (${configuredAdmin}).`);
    }

    return result.user;
  } catch (err) {
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error('Email/Password provider is not enabled in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.');
    }
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password. If you have not created your admin user yet, add it in Firebase Console > Authentication > Users.');
    }
    if (err.code === 'auth/too-many-requests') {
      throw new Error('Access temporarily blocked due to many failed attempts. Try again later.');
    }
    throw err;
  }
};

export const logoutAdmin = () => signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
