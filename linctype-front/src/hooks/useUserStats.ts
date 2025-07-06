import { useEffect } from 'react';
import { useGetUserStats, useGetTests } from './useApi';
import { useAuth } from './useAuth';

export function useUserStats() {
  const { user } = useAuth();
  const statsApi = useGetUserStats();
  const testsApi = useGetTests();

  useEffect(() => {
    if (user) {
      statsApi.execute();
    }
  }, [user]);

  const loadTests = async (limit?: number) => {
    if (user) {
      return testsApi.execute(limit);
    }
  };

  const refreshStats = async () => {
    if (user) {
      return statsApi.execute();
    }
  };

  return {
    stats: statsApi.data,
    tests: testsApi.data,
    loadingStats: statsApi.loading,
    loadingTests: testsApi.loading,
    statsError: statsApi.error,
    testsError: testsApi.error,
    loadTests,
    refreshStats,
  };
}