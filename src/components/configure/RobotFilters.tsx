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
import type { ConfigureSearchParams } from "@/routes/configure";
import type { RobotQueryParams, Robot } from "@/services/robots";

export const RobotFilters = () => {
    const navigate = useNavigate();
    const search = useSearch({ from: "/configure/" }) as ConfigureSearchParams;

    const [localFilters, setLocalFilters] = React.useState({
        search: search.search || "",
        minCharge: search.minCharge?.toString() || "",
        maxCharge: search.maxCharge?.toString() || "",
        location: search.location || "",
    });

    const updateUrlParams = React.useCallback(
        (newParams: Partial<RobotQueryParams>) => {
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
                to: "/configure",
                search: updatedParams,
            });
        },
        [navigate, search]
    );

    const handleApplyFilters = () => {
        const params: Partial<RobotQueryParams> = {};

        if (localFilters.search.trim()) {
            params.search = localFilters.search.trim();
        }
        if (localFilters.location.trim()) {
            params.location = localFilters.location.trim();
        }
        if (
            localFilters.minCharge &&
            !Number.isNaN(Number(localFilters.minCharge))
        ) {
            params.minCharge = Number(localFilters.minCharge);
        }
        if (
            localFilters.maxCharge &&
            !Number.isNaN(Number(localFilters.maxCharge))
        ) {
            params.maxCharge = Number(localFilters.maxCharge);
        }

        updateUrlParams(params);
    };

    const handleClearFilters = () => {
        setLocalFilters({
            search: "",
            minCharge: "",
            maxCharge: "",
            location: "",
        });

        navigate({
            to: "/configure",
            search: {},
        });
    };

    const hasActiveFilters =
        search.search ||
        search.status ||
        search.type ||
        search.connectivity ||
        search.minCharge !== undefined ||
        search.maxCharge !== undefined ||
        search.location;

    return (
        <div className="bg-white border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
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
                        placeholder="Search robots..."
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

                {/* Status Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="status-select"
                        className="text-sm font-medium"
                    >
                        Status
                    </label>
                    <Select
                        value={search.status || "all"}
                        onValueChange={(value) =>
                            updateUrlParams({
                                status:
                                    value === "all"
                                        ? undefined
                                        : (value as Robot["status"]),
                            })
                        }
                    >
                        <SelectTrigger id="status-select">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="CHARGING">Charging</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="type-select"
                        className="text-sm font-medium"
                    >
                        Type
                    </label>
                    <Select
                        value={search.type || "all"}
                        onValueChange={(value) =>
                            updateUrlParams({
                                type:
                                    value === "all"
                                        ? undefined
                                        : (value as Robot["type"]),
                            })
                        }
                    >
                        <SelectTrigger id="type-select">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="TUGGER">Tugger</SelectItem>
                            <SelectItem value="CONVEYOR">Conveyor</SelectItem>
                            <SelectItem value="FORKLIFT">Forklift</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Connectivity Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="connectivity-select"
                        className="text-sm font-medium"
                    >
                        Connectivity
                    </label>
                    <Select
                        value={search.connectivity || "all"}
                        onValueChange={(value) =>
                            updateUrlParams({
                                connectivity:
                                    value === "all"
                                        ? undefined
                                        : (value as Robot["connectivity"]),
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Connectivity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="CONNECTED">Connected</SelectItem>
                            <SelectItem value="DISCONNECTED">
                                Disconnected
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                    <label
                        htmlFor="location-input"
                        className="text-sm font-medium"
                    >
                        Location
                    </label>
                    <Input
                        id="location-input"
                        placeholder="Filter by location..."
                        value={localFilters.location}
                        onChange={(e) =>
                            setLocalFilters((prev) => ({
                                ...prev,
                                location: e.target.value,
                            }))
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyFilters()
                        }
                    />
                </div>

                {/* Charge Range */}
                <div className="space-y-2">
                    <label
                        htmlFor="min-charge-input"
                        className="text-sm font-medium"
                    >
                        Min Charge (%)
                    </label>
                    <Input
                        id="min-charge-input"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={localFilters.minCharge}
                        onChange={(e) =>
                            setLocalFilters((prev) => ({
                                ...prev,
                                minCharge: e.target.value,
                            }))
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyFilters()
                        }
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="max-charge-input"
                        className="text-sm font-medium"
                    >
                        Max Charge (%)
                    </label>
                    <Input
                        id="max-charge-input"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="100"
                        value={localFilters.maxCharge}
                        onChange={(e) =>
                            setLocalFilters((prev) => ({
                                ...prev,
                                maxCharge: e.target.value,
                            }))
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyFilters()
                        }
                    />
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
                        {search.status && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Status: {search.status}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ status: undefined })
                                    }
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search.type && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                Type: {search.type}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ type: undefined })
                                    }
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search.connectivity && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                Connectivity: {search.connectivity}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({
                                            connectivity: undefined,
                                        })
                                    }
                                    className="ml-1 text-orange-600 hover:text-orange-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {(search.minCharge !== undefined ||
                            search.maxCharge !== undefined) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                Charge: {search.minCharge || 0}% -{" "}
                                {search.maxCharge || 100}%
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({
                                            minCharge: undefined,
                                            maxCharge: undefined,
                                        })
                                    }
                                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search.location && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                Location: {search.location}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateUrlParams({ location: undefined })
                                    }
                                    className="ml-1 text-gray-600 hover:text-gray-800"
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

export default RobotFilters;
