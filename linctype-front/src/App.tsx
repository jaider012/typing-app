import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from './components/ui/color-mode';
import { AuthProvider } from './contexts/AuthContext';
import { TypingTestPage } from './components';
import { ProfilePage } from './components/pages/ProfilePage';
import { LeaderboardPage } from './components/pages/LeaderboardPage';

const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<TypingTestPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default App;