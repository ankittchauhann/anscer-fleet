// Authentication API service
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
    details?: unknown;
}

export class ApiError extends Error {
    status: number;
    response?: Response;

    constructor(status: number, message: string, response?: Response) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.response = response;
    }
}

// Login API call (dedicated to auth to avoid circular dependencies)
export const loginUser = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const url = `${API_BASE_URL}/users/auth`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle specific error responses from backend
            const errorMessage =
                data.message ||
                data.error ||
                `HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(response.status, errorMessage, response);
        }

        // Check if backend returned success: false even with 200 status
        if (data.success === false) {
            throw new ApiError(
                400,
                data.message || data.error || "Authentication failed",
                response
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        throw new ApiError(
            0,
            error instanceof Error ? error.message : "Unknown error occurred"
        );
    }
};

// Token management utilities
export const getStoredToken = (): string | null => {
    return localStorage.getItem("authToken");
};

export const setStoredToken = (token: string): void => {
    localStorage.setItem("authToken", token);
};

export const removeStoredToken = (): void => {
    localStorage.removeItem("authToken");
};

export const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem("authUser");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const setStoredUser = (user: User): void => {
    localStorage.setItem("authUser", JSON.stringify(user));
};

export const removeStoredUser = (): void => {
    localStorage.removeItem("authUser");
};

// Check if token is valid (you can enhance this with JWT decode)
export const isTokenValid = (token: string): boolean => {
    if (!token) return false;

    // Basic validation - in production you might want to decode JWT and check expiry
    try {
        // You can add JWT decode here if needed
        return token.length > 0;
    } catch {
        return false;
    }
};
