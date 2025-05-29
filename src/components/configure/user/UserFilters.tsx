import React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { UserQueryParams } from "@/services/users";

// Define the search params type for user route
interface UserSearchParams extends UserQueryParams {
    page?: number;
    limit?: number;
}

export const UserFilters = () => {
    const navigate = useNavigate();
    const search = useSearch({ from: "/configure/user" }) as UserSearchParams;

    const [localFilters, setLocalFilters] = React.useState({
        search: search.search || "",
    });

    const updateUrlParams = React.useCallback(
        (newParams: Partial<UserQueryParams>) => {
            const updatedParams = {
                ...search,
                ...newParams,
                // Reset to page 1 when filters change
                page: newParams.page !== undefined ? newParams.page : 1,
            };

            // Remove undefined values
            Object.keys(updatedParams).forEach((key) => {
                if (
                    updatedParams[key as keyof typeof updatedParams] ===
                    undefined
                ) {
                    delete updatedParams[key as keyof typeof updatedParams];
                }
            });

            navigate({
                to: "/configure/user",
                search: updatedParams,
            });
        },
        [navigate, search]
    );

    const handleApplyFilters = () => {
        const params: Partial<UserQueryParams> = {};

        if (localFilters.search.trim()) {
            params.search = localFilters.search.trim();
        }

        updateUrlParams(params);
    };

    const handleClearFilters = () => {
        setLocalFilters({
            search: "",
        });

        navigate({
            to: "/configure/user",
            search: {},
        });
    };

    const hasActiveFilters =
        search.search || search.role || search.isActive !== undefined;

    return (
        <div className="bg-white border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">User Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                    >
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Global Search */}
                <div className="space-y-2">
                    <label
                        htmlFor="search-input"
                        className="text-sm font-medium"
                    >
                        Search
                    </label>
                    <Input
                        id="search-input"
                        placeholder="Search users..."
                        value={localFilters.search}
                        onChange={(e) =>
                            setLocalFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyFilters()
                        }
                    />
                </div>

                {/* Role Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="role-select"
                        className="text-sm font-medium"
                    >
                        Role
                    </label>
                    <Select
                        value={search.role || "all"}
                        onValueChange={(value) =>
                            updateUrlParams({
                                role: value === "all" ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger id="role-select">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="status-select"
                        className="text-sm font-medium"
                    >
                        Status
                    </label>
                    <Select
                        value={
                            search.isActive === undefined
                                ? "all"
                                : search.isActive
                                  ? "active"
                                  : "inactive"
                        }
                        onValueChange={(value) =>
                            updateUrlParams({
                                isActive:
                                    value === "all"
                                        ? undefined
                                        : value === "active",
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Apply Button */}
                <div className="flex items-end">
                    <Button onClick={handleApplyFilters} className="w-full">
                        Apply Filters
                    </Button>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">
                            Active filters:
                        </span>
                        {search.search && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Search: {search.search}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ search: undefined })
                                    }
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search.role && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Role: {search.role}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ role: undefined })
                                    }
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search.isActive !== undefined && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                Status:{" "}
                                {search.isActive ? "Active" : "Inactive"}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ isActive: undefined })
                                    }
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFilters;
