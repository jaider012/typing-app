import {
  CreateTestDto,
  TestResult,
  UserStats,
  UserProfile,
  LeaderboardEntry,
} from "./types";
import useHttp from "../hooks/useHttp";

// Hook personalizado para el servicio de typing
export const useTypingService = () => {
  const { get, post, loading, error, clearError } = useHttp();

  // Typing Tests
  const createTest = async (
    data: CreateTestDto
  ): Promise<TestResult | null> => {
    try {
      const response = await post<TestResult>("/typing", data);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getTests = async (limit?: number): Promise<TestResult[] | null> => {
    const params = limit ? { limit } : undefined;
    try {
      const data = await get<TestResult[]>("/typing", params);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getUserStats = async (): Promise<UserStats | null> => {
    try {
      const data = await get<UserStats>("/typing/stats");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // User Profile
  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const data = await get<UserProfile>("/users/profile");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Leaderboards (public endpoints)
  const getWpmLeaderboard = async (
    limit: number = 10
  ): Promise<LeaderboardEntry[] | null> => {
    try {
      const data = await get<LeaderboardEntry[]>("/leaderboard/wpm", { limit });
      return data.map((entry) => ({
        ...entry,
        value: entry.wpm || 0,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getAccuracyLeaderboard = async (
    limit: number = 10
  ): Promise<LeaderboardEntry[] | null> => {
    try {
      const data = await get<LeaderboardEntry[]>("/leaderboard/accuracy", {
        limit,
      });
      return data.map((entry) => ({
        ...entry,
        value: entry.accuracy || 0,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getScoreLeaderboard = async (
    limit: number = 10
  ): Promise<LeaderboardEntry[] | null> => {
    try {
      const data = await get<LeaderboardEntry[]>("/leaderboard/score", {
        limit,
      });
      return data.map((entry) => ({
        ...entry,
        value: entry.score || 0,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return {
    // Estados
    loading,
    error,
    clearError,

    // Métodos
    createTest,
    getTests,
    getUserStats,
    getUserProfile,
    getWpmLeaderboard,
    getAccuracyLeaderboard,
    getScoreLeaderboard,
  };
};
