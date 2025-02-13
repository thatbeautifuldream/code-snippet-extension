import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      retry: (failureCount: number, error: any) => {
        // Don't retry on 404s or auth errors
        if (error && (error.status === 404 || error.status === 401))
          return false;
        return failureCount < 3;
      },
    },
  },
});
