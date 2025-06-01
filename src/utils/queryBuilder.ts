// Utility functions for building backend-compatible query parameters
import type { RobotQueryParams } from "@/services/robots";
import type { UserQueryParams } from "@/services/users";

// Generic query parameters interface
export interface BaseQueryParams {
    page?: number;
    currentPage?: number;
    limit?: number;
    sort?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    [key: string]: string | number | undefined;
}

/**
 * Converts robot query parameters to backend-compatible format
 * Handles MongoDB-style operators and proper encoding
 */
export const buildRobotBackendQuery = (
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
 * Converts user query parameters to backend-compatible format
 */
export const buildUserBackendQuery = (
    params: UserQueryParams
): Record<string, string> => {
    const query: Record<string, string> = {};

    // Handle pagination
    if (params.page !== undefined && params.page > 0) {
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

    // Handle search - map to 'name' parameter for backend
    if (params.search?.trim()) {
        query.name = params.search.trim();
    }

    // Handle exact match filters
    if (params.role) {
        query.role = params.role;
    }
    if (params.isActive !== undefined) {
        query.isActive = String(params.isActive);
    }

    return query;
};

// Legacy function for backward compatibility
export const buildBackendQuery = buildRobotBackendQuery;

/**
 * Builds a search query string from robot parameters
 */
export const buildRobotQueryString = (params: RobotQueryParams): string => {
    const query = buildRobotBackendQuery(params);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            searchParams.append(key, value);
        }
    }

    return searchParams.toString();
};

/**
 * Builds a search query string from user parameters
 */
export const buildUserQueryString = (params: UserQueryParams): string => {
    const query = buildUserBackendQuery(params);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
            searchParams.append(key, value);
        }
    }

    return searchParams.toString();
};

// Legacy function for backward compatibility
export const buildQueryString = buildRobotQueryString;

/**
 * Validates and normalizes robot query parameters
 */
export const normalizeRobotQueryParams = (
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
 * Validates and normalizes user query parameters
 */
export const normalizeUserQueryParams = (
    params: UserQueryParams
): UserQueryParams => {
    const normalized: UserQueryParams = {};

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
        params.role &&
        ["admin", "user", "operator", "viewer"].includes(params.role)
    ) {
        normalized.role = params.role;
    }
    if (params.isActive !== undefined) {
        normalized.isActive = params.isActive;
    }

    // Normalize sorting
    if (params.sortBy && params.sortOrder) {
        normalized.sortBy = params.sortBy;
        normalized.sortOrder = params.sortOrder === "desc" ? "desc" : "asc";
    }

    return normalized;
};

// Legacy function for backward compatibility
export const normalizeQueryParams = normalizeRobotQueryParams;

/**
 * Builds a cache key for React Query from normalized robot parameters
 */
export const buildRobotCacheKey = (params: RobotQueryParams): string[] => {
    const normalized = normalizeRobotQueryParams(params);
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
 * Builds a cache key for React Query from normalized user parameters
 */
export const buildUserCacheKey = (params: UserQueryParams): string[] => {
    const normalized = normalizeUserQueryParams(params);
    const cacheKey = ["users"];

    // Add normalized parameters to cache key in a deterministic order
    const keys = Object.keys(normalized).sort();
    for (const key of keys) {
        const value = normalized[key as keyof UserQueryParams];
        if (value !== undefined && value !== "") {
            cacheKey.push(`${key}:${value}`);
        }
    }

    return cacheKey;
};

// Legacy function for backward compatibility
export const buildCacheKey = buildRobotCacheKey;

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
 * Default query parameters for users
 */
export const defaultUserQueryParams: UserQueryParams = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    // Sort by most recently created by default
};

/**
 * Merges robot user parameters with defaults
 */
export const mergeRobotWithDefaults = (
    params: Partial<RobotQueryParams>
): RobotQueryParams => {
    return { ...defaultRobotQueryParams, ...params };
};

/**
 * Merges user parameters with defaults
 */
export const mergeUserWithDefaults = (
    params: Partial<UserQueryParams>
): UserQueryParams => {
    return { ...defaultUserQueryParams, ...params };
};

// Legacy function for backward compatibility
export const mergeWithDefaults = mergeRobotWithDefaults;

/**
 * Helper to check if any robot filters are active
 */
export const hasActiveRobotFilters = (params: RobotQueryParams): boolean => {
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
 * Helper to check if any user filters are active
 */
export const hasActiveUserFilters = (params: UserQueryParams): boolean => {
    return !!(params.search || params.role || params.isActive !== undefined);
};

// Legacy function for backward compatibility
export const hasActiveFilters = hasActiveRobotFilters;

/**
 * Helper to clear all robot filters but keep pagination and sorting
 */
export const clearRobotFilters = (
    params: RobotQueryParams
): RobotQueryParams => {
    return {
        page: params.page,
        limit: params.limit,
        sort: params.sort,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    };
};

/**
 * Helper to clear all user filters but keep pagination and sorting
 */
export const clearUserFilters = (params: UserQueryParams): UserQueryParams => {
    return {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    };
};

// Legacy function for backward compatibility
export const clearFilters = clearRobotFilters;
