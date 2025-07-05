import React, { ReactNode, useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { useColorMode } from '../../ui/color-mode';
import { useDisclosure } from '../../../hooks/useDisclosure';
// import { SettingsModal } from '../../organisms/SettingsModal/SettingsModal';
import { User } from '../../../types/user';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  user?: User;
  onAuthAction?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavigation = true,
  user,
  onAuthAction = () => {}
}) => {
  const { toggleColorMode } = useColorMode();
  const { 
    isOpen: isSettingsOpen, 
    onOpen: onSettingsOpen, 
    onClose: onSettingsClose 
  } = useDisclosure();

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
          user={user}
          onThemeToggle={toggleColorMode}
          onSettingsOpen={onSettingsOpen}
          onAuthAction={onAuthAction}
        />
      )}
      
      <Container maxW="1200px" py={8}>
        {children}
      </Container>
      
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