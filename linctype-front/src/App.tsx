import React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';
import { TypingTestPage } from './components';

const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <TypingTestPage />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default App;