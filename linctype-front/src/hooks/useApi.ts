import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

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
  const apiFunction = useCallback((data: any) => apiService.createTest(data), []);
  return useApi(apiFunction);
}

export function useGetTests() {
  const apiFunction = useCallback((limit?: number) => apiService.getTests(limit), []);
  return useApi(apiFunction);
}

export function useGetUserStats() {
  const apiFunction = useCallback(() => apiService.getUserStats(), []);
  return useApi(apiFunction);
}

export function useGetUserProfile() {
  const apiFunction = useCallback(() => apiService.getUserProfile(), []);
  return useApi(apiFunction);
}

export function useGetWpmLeaderboard() {
  const apiFunction = useCallback((limit?: number) => apiService.getWpmLeaderboard(limit), []);
  return useApi(apiFunction);
}

export function useGetAccuracyLeaderboard() {
  const apiFunction = useCallback((limit?: number) => apiService.getAccuracyLeaderboard(limit), []);
  return useApi(apiFunction);
}

export function useGetScoreLeaderboard() {
  const apiFunction = useCallback((limit?: number) => apiService.getScoreLeaderboard(limit), []);
  return useApi(apiFunction);
}