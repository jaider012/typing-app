import { useState, useCallback } from "react";
import { useTypingService } from "../services/typing.service";

export const useCreateTest = () => {
  const { createTest, loading, error, clearError } = useTypingService();
  const [data, setData] = useState<any>(null);
  
  const execute = useCallback(async (payload: any) => {
    const result = await createTest(payload);
    setData(result);
    return result;
  }, [createTest]);
  
  const reset = useCallback(() => {
    setData(null);
  }, []);
  
  return {
    execute,
    data,
    loading,
    error,
    clearError,
    reset
  };
};

export const useGetTests = () => {
  const { getTests, loading, error, clearError } = useTypingService();
  const [data, setData] = useState<any>(null);
  
  const execute = useCallback(async (limit?: number) => {
    const result = await getTests(limit);
    setData(result);
    return result;
  }, [getTests]);
  
  return {
    execute,
    data,
    loading,
    error,
    clearError
  };
};

export const useGetUserStats = () => {
  const { getUserStats, loading, error, clearError } = useTypingService();
  const [data, setData] = useState<any>(null);
  
  const execute = useCallback(async () => {
    const result = await getUserStats();
    setData(result);
    return result;
  }, [getUserStats]);
  
  return {
    execute,
    data,
    loading,
    error,
    clearError
  };
};

export const useGetUserProfile = () => {
  const { getUserProfile, loading, error, clearError } = useTypingService();
  
  return {
    getUserProfile,
    loading,
    error,
    clearError
  };
};

export const useGetWpmLeaderboard = () => {
  const { getWpmLeaderboard, loading, error, clearError } = useTypingService();
  
  return {
    getWpmLeaderboard,
    loading,
    error,
    clearError
  };
};

export const useGetAccuracyLeaderboard = () => {
  const { getAccuracyLeaderboard, loading, error, clearError } = useTypingService();
  
  return {
    getAccuracyLeaderboard,
    loading,
    error,
    clearError
  };
};

export const useGetScoreLeaderboard = () => {
  const { getScoreLeaderboard, loading, error, clearError } = useTypingService();
  
  return {
    getScoreLeaderboard,
    loading,
    error,
    clearError
  };
};