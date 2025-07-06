import React, { useEffect } from 'react';
import { VStack, HStack, Box, Text, Grid, Spinner, Center } from '@chakra-ui/react';
import { MainLayout } from '../../templates/MainLayout/MainLayout';
import { StatCard } from '../../atoms';
import { ResultMetric } from '../../molecules';
import { MotionBox } from '../../atoms/MotionBox';
import { useUserStats } from '../../../hooks/useUserStats';
import { useAuth } from '../../../hooks/useAuth';
import { TestResult } from '../../../services/types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const {
    stats,
    tests,
    loadingStats,
    loadingTests,
    statsError,
    testsError,
    loadTests,
    refreshStats
  } = useUserStats();

  useEffect(() => {
    if (user) {
      loadTests(10); // Load last 10 tests
    }
  }, [user, loadTests]);

  if (!user) {
    return (
      <MainLayout>
        <Center minH="50vh">
          <VStack gap={4}>
            <Text fontSize="xl" color="main" fontFamily="mono">
              Please sign in to view your profile
            </Text>
          </VStack>
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <VStack gap={8} align="stretch" w="full" maxW="6xl" mx="auto">
        {/* Profile Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" p={6}>
            <Text fontSize="3xl" fontWeight="bold" color="main" fontFamily="mono">
              {user.displayName || 'Typing Enthusiast'}
            </Text>
            <Text fontSize="md" color="sub" fontFamily="mono">
              {user.email}
            </Text>
          </Box>
        </MotionBox>

        {/* Statistics Overview */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" color="main" fontFamily="mono" mb={4}>
              Statistics Overview
            </Text>
            
            {loadingStats ? (
              <Center p={8}>
                <Spinner size="lg" color="caret" />
              </Center>
            ) : statsError ? (
              <Box p={4} bg="card" borderRadius="md" textAlign="center">
                <Text color="sub" fontFamily="mono">
                  Error loading statistics: {statsError}
                </Text>
              </Box>
            ) : stats ? (
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                <StatCard
                  label="Best WPM"
                  value={stats.bestWpm}
                  icon={<Text>⚡</Text>}
                />
                <StatCard
                  label="Best Accuracy"
                  value={`${stats.bestAccuracy}%`}
                  icon={<Text>🎯</Text>}
                />
                <StatCard
                  label="Tests Completed"
                  value={stats.totalTests}
                  icon={<Text>📊</Text>}
                />
                <StatCard
                  label="Average WPM"
                  value={stats.averageWpm}
                  icon={<Text>📈</Text>}
                />
                <StatCard
                  label="Average Accuracy"
                  value={`${stats.averageAccuracy}%`}
                  icon={<Text>✅</Text>}
                />
                <StatCard
                  label="Best Score"
                  value={stats.bestScore}
                  icon={<Text>🏆</Text>}
                />
              </Grid>
            ) : (
              <Box p={4} bg="card" borderRadius="md" textAlign="center">
                <Text color="sub" fontFamily="mono">
                  No statistics available yet. Complete some tests to see your stats!
                </Text>
              </Box>
            )}
          </Box>
        </MotionBox>

        {/* Recent Tests */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="main" fontFamily="mono" mb={4}>
              Recent Tests
            </Text>
            
            {loadingTests ? (
              <Center p={8}>
                <Spinner size="lg" color="caret" />
              </Center>
            ) : testsError ? (
              <Box p={4} bg="card" borderRadius="md" textAlign="center">
                <Text color="sub" fontFamily="mono">
                  Error loading tests: {testsError}
                </Text>
              </Box>
            ) : tests && tests.length > 0 ? (
              <VStack gap={4} align="stretch">
                {tests.map((test: TestResult, index: number) => (
                  <Box
                    key={test.id}
                    p={4}
                    bg="card"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="border"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="sub" fontFamily="mono">
                        {new Date(test.createdAt).toLocaleDateString()} at{' '}
                        {new Date(test.createdAt).toLocaleTimeString()}
                      </Text>
                      <Text fontSize="sm" color="caret" fontFamily="mono">
                        Score: {test.score}
                      </Text>
                    </HStack>
                    
                    <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4}>
                      <Box textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" color="main" fontFamily="mono">
                          {test.wpm}
                        </Text>
                        <Text fontSize="xs" color="sub" fontFamily="mono">
                          WPM
                        </Text>
                      </Box>
                      <Box textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" color="main" fontFamily="mono">
                          {test.accuracy}%
                        </Text>
                        <Text fontSize="xs" color="sub" fontFamily="mono">
                          Accuracy
                        </Text>
                      </Box>
                      <Box textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" color="main" fontFamily="mono">
                          {test.wordsTyped}
                        </Text>
                        <Text fontSize="xs" color="sub" fontFamily="mono">
                          Words
                        </Text>
                      </Box>
                      <Box textAlign="center">
                        <Text fontSize="lg" fontWeight="bold" color="main" fontFamily="mono">
                          {test.timeSpent}s
                        </Text>
                        <Text fontSize="xs" color="sub" fontFamily="mono">
                          Time
                        </Text>
                      </Box>
                    </Grid>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box p={4} bg="card" borderRadius="md" textAlign="center">
                <Text color="sub" fontFamily="mono">
                  No tests completed yet. Start typing to see your results here!
                </Text>
              </Box>
            )}
          </Box>
        </MotionBox>
      </VStack>
    </MainLayout>
  );
};