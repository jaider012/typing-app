/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from "react";
import { useGetUserStats, useGetTests } from "./useApi";
import { useAuth } from "./useAuth";

export function useUserStats() {
  const { user } = useAuth();
  const statsApi = useGetUserStats();
  const testsApi = useGetTests();

  useEffect(() => {
    if (user) {
      statsApi.execute();
    }
  }, [user, statsApi.execute]);

  const loadTests = useCallback(
    async (limit?: number) => {
      if (user) {
        return testsApi.execute(limit);
      }
    },
    [user, testsApi.execute]
  );

  const refreshStats = useCallback(async () => {
    if (user) {
      return statsApi.execute();
    }
  }, [user, statsApi.execute]);

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
