import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
    DataTable,
    type PaginationInfo,
    type BaseQueryParams,
} from "@/components/ui/data-table";
import type { User } from "@/services/auth";
import type { UserQueryParams } from "@/services/users";
import type { ColumnDef } from "@tanstack/react-table";

// Extend BaseQueryParams for User-specific parameters
interface UserDataTableQueryParams extends BaseQueryParams {
    role?: string;
    isActive?: boolean;
    search?: string;
}

interface UserDataTableProps {
    columns: ColumnDef<User>[];
    data: User[];
    isLoading?: boolean;
    pagination?: PaginationInfo;
    onParamsChange?: (params: UserQueryParams) => void;
}

export function UserDataTable({
    columns,
    data,
    isLoading = false,
    pagination,
    onParamsChange,
}: UserDataTableProps) {
    const navigate = useNavigate();
    const search = useSearch({ from: "/configure/user" });

    // Handle parameter changes with user-specific logic
    const handleParamsChange = React.useCallback(
        (newParams: Partial<UserDataTableQueryParams>) => {
            console.log(
                "🚀 UserDataTable: handleParamsChange called with:",
                newParams
            );
            console.log("🚀 UserDataTable: current search params:", search);

            const updatedParams = {
                ...search,
                ...newParams,
                // Only reset to page 1 when filters change, not when page itself changes
                page:
                    newParams.page !== undefined
                        ? newParams.page
                        : // Reset to page 1 if we're changing filters but not page
                          newParams.role !== undefined ||
                            newParams.isActive !== undefined ||
                            newParams.search !== undefined ||
                            newParams.sortBy !== undefined ||
                            newParams.limit !== undefined
                          ? 1
                          : search.page || 1,
            };

            // Remove undefined values
            for (const [key, value] of Object.entries(updatedParams)) {
                if (value === undefined) {
                    delete updatedParams[key as keyof typeof updatedParams];
                }
            }

            console.log(
                "🚀 UserDataTable: about to navigate with params:",
                updatedParams
            );

            try {
                navigate({
                    to: "/configure/user",
                    search: updatedParams,
                    replace: false,
                });
                console.log(
                    "✅ UserDataTable: navigate() call completed successfully"
                );
            } catch (error) {
                console.error("❌ UserDataTable: navigate() failed:", error);
            }

            onParamsChange?.(updatedParams);
        },
        [navigate, search, onParamsChange]
    );

    // Custom row styling for alternating backgrounds
    const getRowClassName = React.useCallback((_row: User, index: number) => {
        return index % 2 === 0 ? "bg-white" : "bg-gray-25";
    }, []);

    return (
        <DataTable<User, UserQueryParams>
            columns={columns}
            data={data}
            isLoading={isLoading}
            pagination={pagination}
            onParamsChange={handleParamsChange}
            getRowClassName={getRowClassName}
            emptyMessage="No users found."
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
    );
}
