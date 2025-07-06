import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    user: context.user,
    loading: context.loading,
    error: context.error,
    signIn: context.signIn,
    signUp: context.signUp,
    signInWithGoogle: context.signInWithGoogle,
    signOut: context.signOut,
    sendPasswordReset: context.sendPasswordReset,
    updateProfile: context.updateProfile,
    getIdToken: context.getIdToken,
    clearError: context.clearError,
    isAuthenticated: !!context.user
  };
};