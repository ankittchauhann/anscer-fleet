import { useQuery } from "@tanstack/react-query";
import { getUsers, type UserQueryParams } from "@/services/users";
import { buildUserCacheKey } from "@/utils/queryBuilder";

interface UseUsersProps {
    params?: UserQueryParams;
    enabled?: boolean;
}

export const useUsers = ({
    params = {},
    enabled = true,
}: UseUsersProps = {}) => {
    return useQuery({
        queryKey: buildUserCacheKey(params),
        queryFn: () => getUsers(params),
        enabled,
        staleTime: 30000, // Consider data fresh for 30 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
