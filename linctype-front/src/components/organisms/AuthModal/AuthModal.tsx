import React, { useState } from 'react';
import {
  createToaster,
  Box,
  Text,
  HStack,
  VStack
} from '@chakra-ui/react';
import { MotionBox } from '../../atoms/MotionBox';
import { ActionButton } from '../../atoms/ActionButton/ActionButton';
import { LoginForm } from '../../molecules/LoginForm';
import { SignUpForm } from '../../molecules/SignUpForm';
import { useAuth } from '../../../hooks/useAuth';
import { LoginFormData, SignUpFormData } from '../../../types/auth';

const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const [currentTab, setCurrentTab] = useState<'login' | 'signup'>(defaultTab);
  const { signIn, signUp, signInWithGoogle, sendPasswordReset, loading, error, clearError } = useAuth();

  const handleClose = () => {
    clearError();
    onClose();
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setCurrentTab(tab);
    clearError();
  };

  const handleLogin = async (data: LoginFormData) => {
    const result = await signIn(data.email, data.password);
    
    if (result.success) {
      toaster.create({
        title: 'Bienvenido',
        description: 'Has iniciado sesión correctamente',
        status: 'success',
        duration: 3000
      });
      handleClose();
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    const result = await signUp(data.email, data.password);
    
    if (result.success) {
      toaster.create({
        title: 'Cuenta creada',
        description: 'Tu cuenta ha sido creada exitosamente',
        status: 'success',
        duration: 3000
      });
      handleClose();
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    
    if (result.success) {
      toaster.create({
        title: 'Bienvenido',
        description: 'Has iniciado sesión con Google',
        status: 'success',
        duration: 3000
      });
      handleClose();
    }
  };

  const handleForgotPassword = async (email: string) => {
    const result = await sendPasswordReset(email);
    
    if (result.success) {
      toaster.create({
        title: 'Email enviado',
        description: 'Revisa tu correo para restablecer la contraseña',
        status: 'success',
        duration: 5000
      });
    } else {
      toaster.create({
        title: 'Error',
        description: result.error || 'Error enviando email de recuperación',
        status: 'error',
        duration: 3000
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={handleClose}
    >
      <MotionBox
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        bg="modal"
        borderColor="border"
        borderRadius="lg"
        border="1px solid"
        p={6}
        maxW="md"
        w="full"
        mx={4}
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={6}>
          <VStack gap={2}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="main" fontFamily="mono">
              {currentTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
            
            <HStack gap={0} bg="gray.100" borderRadius="md" p={1}>
              <ActionButton
                variant={currentTab === 'login' ? 'solid' : 'ghost'}
                size="sm"
                onClick={() => handleTabChange('login')}
                borderRadius="sm"
                bg={currentTab === 'login' ? 'white' : 'transparent'}
                color={currentTab === 'login' ? 'main' : 'sub'}
                _hover={{
                  bg: currentTab === 'login' ? 'white' : 'gray.50'
                }}
              >
                Iniciar Sesión
              </ActionButton>
              <ActionButton
                variant={currentTab === 'signup' ? 'solid' : 'ghost'}
                size="sm"
                onClick={() => handleTabChange('signup')}
                borderRadius="sm"
                bg={currentTab === 'signup' ? 'white' : 'transparent'}
                color={currentTab === 'signup' ? 'main' : 'sub'}
                _hover={{
                  bg: currentTab === 'signup' ? 'white' : 'gray.50'
                }}
              >
                Crear Cuenta
              </ActionButton>
            </HStack>
          </VStack>

          {currentTab === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={handleForgotPassword}
              onSwitchToSignUp={() => handleTabChange('signup')}
              onGoogleSignIn={handleGoogleSignIn}
              loading={loading}
              error={error}
            />
          ) : (
            <SignUpForm
              onSubmit={handleSignUp}
              onSwitchToLogin={() => handleTabChange('login')}
              onGoogleSignIn={handleGoogleSignIn}
              loading={loading}
              error={error}
            />
          )}
        </VStack>
      </MotionBox>
    </Box>
  );
};