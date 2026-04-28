import { useState, useCallback } from "react";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing async API calls with loading and error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [asyncFunction]);

  // Execute on mount if immediate is true
  useCallback(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate])();

  return { ...state, execute };
}

/**
 * Hook for managing async operations (for manual triggering)
 */
export function useAsyncMutation<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await asyncFunction(...args);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [asyncFunction]
  );

  return { ...state, execute };
}
