import { useState, useEffect, useCallback } from "react";
import { useTypingService } from "../services/typing.service";
import { useAuth } from "./useAuth";
import { UserStats, TestResult } from "../services/types";

export function useUserStats() {
  const { user } = useAuth();
  const typingService = useTypingService();
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [testsError, setTestsError] = useState<string | null>(null);

  // Load stats automatically when user is available
  useEffect(() => {
    if (user) {
      const loadStats = async () => {
        setLoadingStats(true);
        setStatsError(null);
        try {
          const userStats = await typingService.getUserStats();
          setStats(userStats);
        } catch (error) {
          setStatsError(error instanceof Error ? error.message : "Failed to load stats");
        } finally {
          setLoadingStats(false);
        }
      };
      
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Solo depende del usuario

  const loadTests = useCallback(
    async (limit?: number) => {
      if (!user) return;
      
      setLoadingTests(true);
      setTestsError(null);
      try {
        const userTests = await typingService.getTests(limit);
        setTests(userTests || []);
      } catch (error) {
        setTestsError(error instanceof Error ? error.message : "Failed to load tests");
      } finally {
        setLoadingTests(false);
      }
    },
    [user, typingService]
  );

  const refreshStats = useCallback(async () => {
    if (!user) return;
    
    setLoadingStats(true);
    setStatsError(null);
    try {
      const userStats = await typingService.getUserStats();
      setStats(userStats);
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : "Failed to refresh stats");
    } finally {
      setLoadingStats(false);
    }
  }, [user, typingService]);

  return {
    stats,
    tests,
    loadingStats,
    loadingTests,
    statsError,
    testsError,
    loadTests,
    refreshStats,
  };
}
