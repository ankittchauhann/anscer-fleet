// API base configuration and utilities
import { getStoredToken } from "./auth";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api";

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

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get auth token and include it in headers if available
    const token = getStoredToken();

    // Build headers object properly
    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            headers: {
                ...defaultHeaders,
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            // Handle unauthorized errors
            if (response.status === 401) {
                // Token might be expired, redirect to login
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }

            throw new ApiError(
                response.status,
                `HTTP ${response.status}: ${response.statusText}`,
                response
            );
        }

        return await response.json();
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
}
