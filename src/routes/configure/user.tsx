import UserScreen from "@/components/configure/user/User";
import { createFileRoute } from "@tanstack/react-router";

export interface UserSearchParams {
    // Search and filtering
    search?: string;
    role?: "admin" | "operator" | "user" | "viewer";
    isActive?: boolean;

    // Pagination
    page?: number;
    limit?: number;

    // Sorting
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;
}

export const Route = createFileRoute("/configure/user")({
    component: UserScreen,
    validateSearch: (search): UserSearchParams => {
        return {
            // Search and basic filters
            search:
                typeof search.search === "string" ? search.search : undefined,
            role:
                typeof search.role === "string" &&
                ["admin", "operator", "user", "viewer"].includes(search.role)
                    ? (search.role as UserSearchParams["role"])
                    : undefined,
            isActive:
                typeof search.isActive === "boolean"
                    ? search.isActive
                    : typeof search.isActive === "string"
                      ? search.isActive === "true"
                      : undefined,

            // Pagination
            page:
                typeof search.page === "number"
                    ? search.page
                    : typeof search.page === "string"
                      ? Number.parseInt(search.page, 10)
                      : undefined,
            limit:
                typeof search.limit === "number"
                    ? search.limit
                    : typeof search.limit === "string"
                      ? Number.parseInt(search.limit, 10)
                      : undefined,

            // Sorting
            sortBy:
                typeof search.sortBy === "string" ? search.sortBy : undefined,
            sortOrder:
                typeof search.sortOrder === "string" &&
                ["asc", "desc"].includes(search.sortOrder)
                    ? (search.sortOrder as "asc" | "desc")
                    : undefined,
            sort: typeof search.sort === "string" ? search.sort : undefined,
        };
    },
});
