import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    robotsApi,
    type Robot,
    type RobotQueryParams,
} from "@/services/robots";

// Query keys for consistent cache management
export const robotQueryKeys = {
    all: ["robots"] as const,
    lists: () => [...robotQueryKeys.all, "list"] as const,
    list: (params?: RobotQueryParams) =>
        [...robotQueryKeys.lists(), params] as const,
    details: () => [...robotQueryKeys.all, "detail"] as const,
    detail: (serialNumber: string) =>
        [...robotQueryKeys.details(), serialNumber] as const,
    stats: () => [...robotQueryKeys.all, "stats"] as const,
};

export interface UseRobotsOptions {
    params?: RobotQueryParams;
    enabled?: boolean;
    refetchInterval?: number;
}

export const useRobots = (options: UseRobotsOptions = {}) => {
    const { params, enabled = true, refetchInterval } = options;

    return useQuery({
        queryKey: robotQueryKeys.list(params),
        queryFn: () => robotsApi.getRobots(params),
        enabled,
        refetchInterval,
        staleTime: 30000, // Consider data fresh for 30 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        retry: 3, // Retry failed requests up to 3 times
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnReconnect: true, // Refetch when network reconnects
        // Ensure query refetches when params change
        refetchOnMount: true,
    });
};

export const useRobot = (serialNumber: string, enabled = true) => {
    return useQuery({
        queryKey: robotQueryKeys.detail(serialNumber),
        queryFn: () => robotsApi.getRobot(serialNumber),
        enabled: enabled && !!serialNumber,
        staleTime: 30000,
    });
};

export const useRobotStats = (enabled = true) => {
    return useQuery({
        queryKey: robotQueryKeys.stats(),
        queryFn: () => robotsApi.getRobotStats(),
        enabled,
        refetchInterval: 10000, // Update stats every 10 seconds
        staleTime: 10000,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

export const useUpdateRobot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            serialNumber,
            updates,
        }: {
            serialNumber: string;
            updates: Partial<Robot>;
        }) => robotsApi.updateRobot(serialNumber, updates),
        onMutate: async ({ serialNumber, updates }) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({
                queryKey: robotQueryKeys.detail(serialNumber),
            });
            await queryClient.cancelQueries({
                queryKey: robotQueryKeys.lists(),
            });

            // Snapshot the previous value
            const previousRobot = queryClient.getQueryData(
                robotQueryKeys.detail(serialNumber)
            );

            // Optimistically update the robot
            if (previousRobot) {
                queryClient.setQueryData(robotQueryKeys.detail(serialNumber), {
                    ...previousRobot,
                    ...updates,
                });
            }

            // Return a context object with the snapshotted value
            return { previousRobot, serialNumber };
        },
        onError: (_err, _variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousRobot) {
                queryClient.setQueryData(
                    robotQueryKeys.detail(context.serialNumber),
                    context.previousRobot
                );
            }
        },
        onSuccess: (updatedRobot) => {
            // Update the robot detail cache with server response
            queryClient.setQueryData(
                robotQueryKeys.detail(updatedRobot.serialNumber),
                updatedRobot
            );
        },
        onSettled: () => {
            // Always refetch after error or success to ensure cache consistency
            queryClient.invalidateQueries({ queryKey: robotQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: robotQueryKeys.stats() });
        },
    });
};

// Utility functions for cache management
export const useInvalidateRobots = () => {
    const queryClient = useQueryClient();

    return {
        invalidateAll: () =>
            queryClient.invalidateQueries({ queryKey: robotQueryKeys.all }),
        invalidateLists: () =>
            queryClient.invalidateQueries({ queryKey: robotQueryKeys.lists() }),
        invalidateStats: () =>
            queryClient.invalidateQueries({ queryKey: robotQueryKeys.stats() }),
        invalidateRobot: (serialNumber: string) =>
            queryClient.invalidateQueries({
                queryKey: robotQueryKeys.detail(serialNumber),
            }),
    };
};

// Hook for prefetching robot data
export const usePrefetchRobot = () => {
    const queryClient = useQueryClient();

    return (serialNumber: string) => {
        queryClient.prefetchQuery({
            queryKey: robotQueryKeys.detail(serialNumber),
            queryFn: () => robotsApi.getRobot(serialNumber),
            staleTime: 30000,
        });
    };
};

// Re-export types for backward compatibility
export type {
    Robot,
    RobotQueryParams,
    RobotsResponse,
} from "@/services/robots";
