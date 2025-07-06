import React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';
import { AuthProvider } from './contexts/AuthContext';
import { TypingTestPage } from './components';

const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <AuthProvider>
          <TypingTestPage />
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default App;