// User management API service
import { apiRequest } from "./api";
import { buildUserQueryString } from "@/utils/queryBuilder";
import type { User } from "./auth";

// Frontend response interface (what we return to components)
export interface GetUsersResponse {
    success: boolean;
    data: User[];
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Backend response interface (what the API actually returns)
interface BackendUsersResponse {
    success: boolean;
    data: User[];
    message?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    isActive?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    role?: string;
    isActive?: boolean;
    sort?: string;
}

// Get all users with optional query parameters
export const getUsers = async (
    params?: UserQueryParams
): Promise<GetUsersResponse> => {
    const queryString = buildUserQueryString(params || {});
    const endpoint = `/users${queryString ? `?${queryString}` : ""}`;
    const response = await apiRequest<BackendUsersResponse>(endpoint);

    // Transform backend pagination format to frontend format
    return {
        success: response.success,
        data: response.data,
        message: response.message,
        pagination: response.pagination
            ? {
                  page: response.pagination.currentPage,
                  limit: response.pagination.limit,
                  total: response.pagination.totalCount,
                  totalPages: response.pagination.totalPages,
              }
            : undefined,
    };
};

// Get user by ID
export const getUserById = async (
    id: string
): Promise<{ success: boolean; data: User }> => {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}`);
};

// Create new user
export const createUser = async (
    userData: CreateUserRequest
): Promise<{ success: boolean; data: User }> => {
    return apiRequest<{ success: boolean; data: User }>("/users", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

// Update user
export const updateUser = async (
    id: string,
    userData: UpdateUserRequest
): Promise<{ success: boolean; data: User }> => {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
    });
};

// Delete user
export const deleteUser = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/users/${id}`, {
        method: "DELETE",
    });
};

// Reset user password
export const resetUserPassword = async (
    id: string,
    passwords: { authPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
        `/users/${id}/reset-password`,
        {
            method: "POST",
            body: JSON.stringify(passwords),
        }
    );
};
