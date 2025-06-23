import { QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: how long before data is considered stale
            staleTime: 30 * 1000, // 30 seconds
            // Cache time: how long to keep unused data in cache
            cacheTime: 5 * 60 * 1000, // 5 minutes

            retry: (failureCount, error: any) => {
                // Don't retry if error code is in the 400s
                if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
                // Retry up to 3 times
                return failureCount < 3;
            },
            // ? Not yet implemented
            // refetchOnWindowFocus: process.env.NODE_ENV === 'production'
        },
        mutations: {
            // Global error handler for mutations
            onError: (error: any) => {
                const message = error?.response?.data?.message || 'Something went wrong';
                toast.error(message);
            }
        }
    }
})