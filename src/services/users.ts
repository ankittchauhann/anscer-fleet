// User management API service
import { apiRequest } from "./api";
import type { User } from "./auth";

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
}

// Get all users with optional query parameters
export const getUsers = async (
    params?: UserQueryParams
): Promise<GetUsersResponse> => {
    const queryString = params
        ? `?${new URLSearchParams(
              Object.entries(params).reduce(
                  (acc, [key, value]) => {
                      if (value !== undefined && value !== null) {
                          acc[key] = value.toString();
                      }
                      return acc;
                  },
                  {} as Record<string, string>
              )
          ).toString()}`
        : "";

    return apiRequest<GetUsersResponse>(`/users${queryString}`);
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
