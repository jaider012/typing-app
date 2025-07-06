import { useState, useCallback } from 'react';
import { apiService, ApiError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = apiService.isApiError(error)
          ? error.message
          : 'Error inesperado';
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export function useCreateTest() {
  return useApi(apiService.createTest.bind(apiService));
}

export function useGetTests() {
  return useApi(apiService.getTests.bind(apiService));
}

export function useGetUserStats() {
  return useApi(apiService.getUserStats.bind(apiService));
}

export function useGetUserProfile() {
  return useApi(apiService.getUserProfile.bind(apiService));
}

export function useGetWpmLeaderboard() {
  return useApi(apiService.getWpmLeaderboard.bind(apiService));
}

export function useGetAccuracyLeaderboard() {
  return useApi(apiService.getAccuracyLeaderboard.bind(apiService));
}

export function useGetScoreLeaderboard() {
  return useApi(apiService.getScoreLeaderboard.bind(apiService));
}