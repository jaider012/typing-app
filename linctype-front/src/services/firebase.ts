import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
console.log(app);
export const auth: Auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const AUTH_ERRORS: { [key: string]: string } = {
  'auth/user-not-found': 'Usuario no encontrado',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/email-already-in-use': 'El email ya está en uso',
  'auth/weak-password': 'La contraseña es demasiado débil',
  'auth/invalid-email': 'Email inválido',
  'auth/user-disabled': 'Usuario deshabilitado',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
  'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
  'auth/cancelled-popup-request': 'Proceso cancelado'
};

const getErrorMessage = (errorCode: string): string => {
  return AUTH_ERRORS[errorCode] || 'Error desconocido';
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: getErrorMessage(error.code) };
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: getErrorMessage(error.code) };
  }
};

export const updateUserProfile = async (displayName?: string, photoURL?: string) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
      return { error: null };
    }
    return { error: 'No hay usuario autenticado' };
  } catch (error: any) {
    return { error: getErrorMessage(error.code) };
  }
};

export const getIdToken = async (): Promise<string | null> => {
  try {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

export { type FirebaseUser };