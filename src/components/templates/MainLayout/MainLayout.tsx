import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { AuthModal } from '../../organisms/AuthModal/AuthModal';
import { useColorMode } from '../../ui/color-mode';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { useAuth } from '../../../hooks/useAuth';
// import { SettingsModal } from '../../organisms/SettingsModal/SettingsModal';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavigation = true
}) => {
  const { toggleColorMode } = useColorMode();
  const { user, signOut } = useAuth();
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const { 
    isOpen: isSettingsOpen, 
    onOpen: onSettingsOpen, 
    onClose: onSettingsClose 
  } = useDisclosure();
  
  const { 
    isOpen: isAuthModalOpen, 
    onOpen: onAuthModalOpen, 
    onClose: onAuthModalClose 
  } = useDisclosure();

  // Handle auth actions
  const handleAuthAction = async () => {
    if (user) {
      // Sign out
      await signOut();
    } else {
      // Open auth modal
      setAuthModalTab('login');
      onAuthModalOpen();
    }
  };

  // ESC key listener for settings modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSettingsOpen) {
        onSettingsOpen();
      } else if (e.key === 'Escape' && isSettingsOpen) {
        onSettingsClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSettingsOpen, onSettingsOpen, onSettingsClose]);

  return (
    <Box minH="100vh" bg="bg" color="main" fontFamily="mono">
      {showNavigation && (
        <Navigation
          user={user ?? undefined}
          onThemeToggle={toggleColorMode}
          onSettingsOpen={onSettingsOpen}
          onAuthAction={handleAuthAction}
        />
      )}
      
      <Container maxW="1200px" py={8}>
        {children}
      </Container>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onAuthModalClose}
        defaultTab={authModalTab}
      />
      
      {/* Settings Modal - TODO: Implement when needed */}
      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
        settings={settings}
        onSettingsChange={updateSettings}
      /> */}
    </Box>
  );
};