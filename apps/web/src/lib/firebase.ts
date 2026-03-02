import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'invalid-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'invalid-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'invalid-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'invalid-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'invalid-id',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'invalid-app',
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(firebaseApp);

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setAuth({ user: currentUser, isLoading: false });
    });

    return unsubscribe;
  }, []);

  const getToken = async (): Promise<string> => {
    if (!firebaseAuth) throw new Error('Firebase não inicializado.');
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado.');
    return currentUser.getIdToken(false);
  };

  const handleSignOut = async (): Promise<void> => {
    if (!firebaseAuth) throw new Error('Firebase não inicializado.');
    await signOut(firebaseAuth);
  };

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    getToken,
    signOut: handleSignOut,
  };
}
