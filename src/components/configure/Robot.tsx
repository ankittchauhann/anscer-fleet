import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useRobots, useRobotStats } from "@/hooks/useRobots";
import type { RobotQueryParams } from "@/services/robots";
import { defaultRobotQueryParams } from "@/utils/queryBuilder";
import type { ConfigureSearchParams } from "@/routes/configure";
import { RobotDataTable } from "./RobotDataTable";
import { getRobotColumns } from "./RobotColumns";

const RobotScreen = () => {
    const searchParams = useSearch({
        from: "/configure/",
    }) as ConfigureSearchParams;

    // Build query parameters from search params
    const queryParams: RobotQueryParams = React.useMemo(() => {
        console.log(
            "Robot: building queryParams from searchParams:",
            searchParams
        );

        const params: RobotQueryParams = {
            page: searchParams.page || defaultRobotQueryParams.page,
            limit: searchParams.limit || defaultRobotQueryParams.limit,
        };

        // Add search if provided
        if (searchParams.search) {
            params.search = searchParams.search;
        }

        // Add filters if provided
        if (searchParams.status) {
            params.status = searchParams.status;
        }
        if (searchParams.type) {
            params.type = searchParams.type;
        }
        if (searchParams.connectivity) {
            params.connectivity = searchParams.connectivity;
        }
        if (searchParams.location) {
            params.location = searchParams.location;
        }

        // Add sorting if provided
        if (searchParams.sortBy && searchParams.sortOrder) {
            params.sortBy = searchParams.sortBy;
            params.sortOrder = searchParams.sortOrder;
        } else if (searchParams.sort) {
            params.sort = searchParams.sort;
        }

        // Add range filters if provided
        if (searchParams.minCharge !== undefined) {
            params.minCharge = searchParams.minCharge;
        }
        if (searchParams.maxCharge !== undefined) {
            params.maxCharge = searchParams.maxCharge;
        }

        console.log("Robot: built queryParams:", params);
        return params;
    }, [searchParams]);

    // Fetch robots data with API
    const {
        data: robotsResponse,
        error,
        isLoading,
        refetch,
    } = useRobots({ params: queryParams });

    // Fetch robot stats
    const { data: robotStats, isLoading: isStatsLoading } = useRobotStats();

    if (error) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Robots
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error.message || "Failed to load robot data"}
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const robots = robotsResponse?.robots || [];
    const pagination = robotsResponse?.pagination;
    const stats = robotStats || {
        total: 0,
        active: 0,
        charging: 0,
        inactive: 0,
        connected: 0,
        disconnected: 0,
        averageCharge: 0,
    };

    return (
        <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Robot Fleet Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Monitor and manage your robot fleet configuration and
                    status.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Robots
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isStatsLoading ? "..." : stats.total}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">
                                T
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {isStatsLoading ? "..." : stats.active}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm font-bold">
                                A
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Charging
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {isStatsLoading ? "..." : stats.charging}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-sm font-bold">
                                C
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Inactive
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {isStatsLoading ? "..." : stats.inactive}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">
                                N
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <RobotDataTable
                        columns={getRobotColumns()}
                        data={robots}
                        isLoading={isLoading}
                        pagination={pagination}
                        onParamsChange={(newParams: RobotQueryParams) => {
                            // This will trigger a re-fetch when pagination changes
                            console.log(
                                "Robot: onParamsChange called with:",
                                newParams
                            );
                            console.log(
                                "Robot: current queryParams:",
                                queryParams
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RobotScreen;
