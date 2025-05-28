// Utility functions for building backend-compatible query parameters
import type { RobotQueryParams } from "@/services/robots";

/**
 * Converts frontend query parameters to backend-compatible format
 * Handles MongoDB-style operators and proper encoding
 */
export const buildBackendQuery = (
    params: RobotQueryParams
): Record<string, string> => {
    const query: Record<string, string> = {};

    // Handle pagination
    if (params.currentPage !== undefined && params.currentPage > 0) {
        query.currentPage = String(params.currentPage);
    } else if (params.page !== undefined && params.page > 0) {
        query.page = String(params.page);
    }
    if (params.limit !== undefined && params.limit > 0) {
        query.limit = String(params.limit);
    }

    // Handle sorting - convert to backend format
    if (params.sortBy && params.sortOrder) {
        query.sort =
            params.sortOrder === "desc" ? `-${params.sortBy}` : params.sortBy;
    } else if (params.sort) {
        query.sort = params.sort;
    }

    // Handle search using regex on serialNumber field (backend doesn't support global search)
    if (params.search?.trim()) {
        query["serialNumber[regex]"] = params.search.trim();
    }

    // Handle exact match filters
    if (params.status) {
        query.status = params.status;
    }
    if (params.type) {
        query.type = params.type;
    }
    if (params.connectivity) {
        query.connectivity = params.connectivity;
    }
    if (params.location) {
        query["location[regex]"] = params.location;
    }

    // Handle regex searches for specific fields
    if (params.serialNumber?.trim()) {
        query["serialNumber[regex]"] = params.serialNumber.trim();
    }

    // Handle range queries for charge
    if (params.minCharge !== undefined && params.minCharge >= 0) {
        query["charge[gte]"] = String(params.minCharge);
    }
    if (params.maxCharge !== undefined && params.maxCharge <= 100) {
        query["charge[lte]"] = String(params.maxCharge);
    }

    // Handle array filters (for multiple selections)
    if (params["status[in]"]) {
        query["status[in]"] = params["status[in]"];
    }
    if (params["type[in]"]) {
        query["type[in]"] = params["type[in]"];
    }
    if (params["connectivity[in]"]) {
        query["connectivity[in]"] = params["connectivity[in]"];
    }

    // Handle regex searches
    if (params["location[regex]"]) {
        query["location[regex]"] = params["location[regex]"];
    }

    // Handle other MongoDB-style operators
    for (const [key, value] of Object.entries(params)) {
        if (
            key.includes("[") &&
            key.includes("]") &&
            value !== undefined &&
            value !== ""
        ) {
            query[key] = String(value);
        }
    }

    return query;
};

/**
 * Builds a search query string from parameters
 */
export const buildQueryString = (params: RobotQueryParams): string => {
    const query = buildBackendQuery(params);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            searchParams.append(key, value);
        }
    }

    return searchParams.toString();
};

/**
 * Validates and normalizes query parameters
 */
export const normalizeQueryParams = (
    params: RobotQueryParams
): RobotQueryParams => {
    const normalized: RobotQueryParams = {};

    // Normalize pagination
    if (params.page !== undefined) {
        normalized.page = Math.max(1, Math.floor(params.page));
    }
    if (params.limit !== undefined) {
        normalized.limit = Math.max(1, Math.min(100, Math.floor(params.limit)));
    }

    // Normalize search
    if (params.search?.trim()) {
        normalized.search = params.search.trim();
    }

    // Validate and normalize filters
    if (
        params.status &&
        ["ACTIVE", "CHARGING", "INACTIVE"].includes(params.status)
    ) {
        normalized.status = params.status;
    }
    if (
        params.type &&
        ["TUGGER", "CONVEYOR", "FORKLIFT"].includes(params.type)
    ) {
        normalized.type = params.type;
    }
    if (
        params.connectivity &&
        ["CONNECTED", "DISCONNECTED"].includes(params.connectivity)
    ) {
        normalized.connectivity = params.connectivity;
    }

    // Normalize sorting
    if (params.sortBy && params.sortOrder) {
        normalized.sortBy = params.sortBy;
        normalized.sortOrder = params.sortOrder === "desc" ? "desc" : "asc";
    } else if (params.sort) {
        normalized.sort = params.sort;
    }

    // Normalize range filters
    if (
        params.minCharge !== undefined &&
        params.minCharge >= 0 &&
        params.minCharge <= 100
    ) {
        normalized.minCharge = Math.floor(params.minCharge);
    }
    if (
        params.maxCharge !== undefined &&
        params.maxCharge >= 0 &&
        params.maxCharge <= 100
    ) {
        normalized.maxCharge = Math.floor(params.maxCharge);
    }

    // Copy other parameters
    if (params.location) {
        normalized.location = params.location;
    }
    if (params.serialNumber) {
        normalized.serialNumber = params.serialNumber;
    }

    // Copy MongoDB-style operators
    for (const [key, value] of Object.entries(params)) {
        if (
            key.includes("[") &&
            key.includes("]") &&
            value !== undefined &&
            value !== ""
        ) {
            (normalized as Record<string, string | number | undefined>)[key] =
                value;
        }
    }

    return normalized;
};

/**
 * Builds a cache key for React Query from normalized parameters
 */
export const buildCacheKey = (params: RobotQueryParams): string[] => {
    const normalized = normalizeQueryParams(params);
    const cacheKey = ["robots"];

    // Add normalized parameters to cache key in a deterministic order
    const keys = Object.keys(normalized).sort();
    for (const key of keys) {
        const value = normalized[key as keyof RobotQueryParams];
        if (value !== undefined && value !== "") {
            cacheKey.push(`${key}:${value}`);
        }
    }

    return cacheKey;
};

/**
 * Default query parameters for robots
 */
export const defaultRobotQueryParams: RobotQueryParams = {
    page: 1,
    limit: 10,
    sort: "-updatedAt",
    // Sort by most recently updated by default
};

/**
 * Merges user parameters with defaults
 */
export const mergeWithDefaults = (
    params: Partial<RobotQueryParams>
): RobotQueryParams => {
    return { ...defaultRobotQueryParams, ...params };
};

/**
 * Helper to check if any filters are active
 */
export const hasActiveFilters = (params: RobotQueryParams): boolean => {
    return !!(
        params.search ||
        params.status ||
        params.type ||
        params.connectivity ||
        params.location ||
        params.minCharge !== undefined ||
        params.maxCharge !== undefined ||
        Object.keys(params).some(
            (key) => key.includes("[") && key.includes("]")
        )
    );
};

/**
 * Helper to clear all filters but keep pagination and sorting
 */
export const clearFilters = (params: RobotQueryParams): RobotQueryParams => {
    return {
        page: params.page,
        limit: params.limit,
        sort: params.sort,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    };
};
