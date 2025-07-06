import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import * as authService from '../services/firebase';
import { AuthContextType, AuthUser, convertFirebaseUser } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? convertFirebaseUser(firebaseUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado durante el inicio de sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signUp(email, password);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado durante el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signInWithGoogle();
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado durante el inicio de sesión con Google';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signOut();
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado durante el cierre de sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);
      const result = await authService.sendPasswordReset(email);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado enviando email de recuperación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string) => {
    try {
      setError(null);
      const result = await authService.updateUserProfile(displayName, photoURL);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Error inesperado actualizando perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      return await authService.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updateProfile,
    getIdToken,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};