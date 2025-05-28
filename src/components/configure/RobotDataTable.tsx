"use client";

import * as React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
    DataTable,
    type PaginationInfo,
    type BaseQueryParams,
} from "@/components/ui/data-table";
import type { Robot, RobotQueryParams } from "@/services/robots";
import type { ColumnDef } from "@tanstack/react-table";

// Extend BaseQueryParams for Robot-specific parameters
interface RobotDataTableQueryParams extends BaseQueryParams {
    status?: string;
    type?: string;
    connectivity?: string;
    search?: string;
    location?: string;
    minCharge?: number;
    maxCharge?: number;
}

interface RobotDataTableProps {
    columns: ColumnDef<Robot>[];
    data: Robot[];
    isLoading?: boolean;
    pagination?: PaginationInfo;
    onParamsChange?: (params: RobotQueryParams) => void;
}

export function RobotDataTable({
    columns,
    data,
    isLoading = false,
    pagination,
    onParamsChange,
}: RobotDataTableProps) {
    const navigate = useNavigate();
    const search = useSearch({ from: "/configure/" });

    // Handle parameter changes with robot-specific logic
    const handleParamsChange = React.useCallback(
        (newParams: Partial<RobotDataTableQueryParams>) => {
            console.log(
                "🚀 RobotDataTable: handleParamsChange called with:",
                newParams
            );
            console.log("🚀 RobotDataTable: current search params:", search);

            const updatedParams = {
                ...search,
                ...newParams,
                // Only reset to page 1 when filters change, not when page itself changes
                page:
                    newParams.page !== undefined
                        ? newParams.page
                        : // Reset to page 1 if we're changing filters but not page
                          newParams.status !== undefined ||
                            newParams.type !== undefined ||
                            newParams.connectivity !== undefined ||
                            newParams.search !== undefined ||
                            newParams.location !== undefined ||
                            newParams.minCharge !== undefined ||
                            newParams.maxCharge !== undefined ||
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
                "🚀 RobotDataTable: about to navigate with params:",
                updatedParams
            );

            try {
                navigate({
                    to: "/configure",
                    search: updatedParams,
                    replace: false,
                });
                console.log(
                    "✅ RobotDataTable: navigate() call completed successfully"
                );
            } catch (error) {
                console.error("❌ RobotDataTable: navigate() failed:", error);
            }

            onParamsChange?.(updatedParams);
        },
        [navigate, search, onParamsChange]
    );

    // Custom row styling for alternating backgrounds
    const getRowClassName = React.useCallback((_row: Robot, index: number) => {
        return index % 2 === 0 ? "bg-white" : "bg-gray-25";
    }, []);

    return (
        <DataTable<Robot, RobotQueryParams>
            columns={columns}
            data={data}
            isLoading={isLoading}
            pagination={pagination}
            onParamsChange={handleParamsChange}
            getRowClassName={getRowClassName}
            emptyMessage="No robots found."
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
    );
}
