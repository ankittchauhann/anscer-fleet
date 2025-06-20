import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useUsers } from "@/hooks/useUsers";
import type { UserQueryParams } from "@/services/users";
import { defaultUserQueryParams } from "@/utils/queryBuilder";
import type { UserSearchParams } from "@/routes/configure/user";
import { UserDataTable } from "./UserDataTable";
import { getUserColumns } from "./UserColumns";
import { UserFilters } from "./UserFilters";
import { showToast } from "@/lib/toast";

const UserScreen = () => {
    const searchParams = useSearch({
        from: "/configure/user",
    }) as UserSearchParams;

    // Build query parameters from search params
    const queryParams: UserQueryParams = React.useMemo(() => {
        console.log(
            "User: building queryParams from searchParams:",
            searchParams
        );

        const params: UserQueryParams = {
            page: searchParams.page || defaultUserQueryParams.page,
            limit: searchParams.limit || defaultUserQueryParams.limit,
        };

        // Add search if provided
        if (searchParams.search) {
            params.search = searchParams.search;
        }

        // Add role filter if provided
        if (searchParams.role) {
            params.role = searchParams.role;
        }

        // Add isActive filter if provided
        if (searchParams.isActive !== undefined) {
            params.isActive = searchParams.isActive;
        }

        // Add sorting if provided
        if (searchParams.sortBy && searchParams.sortOrder) {
            params.sortBy = searchParams.sortBy;
            params.sortOrder = searchParams.sortOrder;
        } else if (searchParams.sort) {
            params.sort = searchParams.sort;
        }

        console.log("User: built queryParams:", params);
        return params;
    }, [searchParams]);

    // Fetch users data with API
    const {
        data: usersResponse,
        error,
        isLoading,
        refetch,
    } = useUsers({ params: queryParams });

    // Show error toast when there's an error
    React.useEffect(() => {
        if (error) {
            showToast.error(
                "Failed to Load Users",
                error.message ||
                    "An unexpected error occurred while loading user data"
            );
        }
    }, [error]);

    // Handle retry with toast feedback
    const handleRetry = async () => {
        try {
            showToast.loading("Retrying...");
            await refetch();
            showToast.success("Success!", "User data loaded successfully");
        } catch (err) {
            showToast.error("Retry Failed", "Unable to load user data");
        }
    };

    if (error) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Users
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error.message || "Failed to load user data"}
                    </p>
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const users = usersResponse?.data || [];
    const pagination = usersResponse?.pagination;

    return (
        <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    User Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage and monitor user accounts, roles, and permissions.
                </p>
            </div>

            {/* Filters */}
            <UserFilters />

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <UserDataTable
                        columns={getUserColumns()}
                        data={users}
                        isLoading={isLoading}
                        pagination={pagination}
                        onParamsChange={(newParams: UserQueryParams) => {
                            // This will trigger a re-fetch when pagination changes
                            console.log(
                                "User: onParamsChange called with:",
                                newParams
                            );
                            console.log(
                                "User: current queryParams:",
                                queryParams
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserScreen;
