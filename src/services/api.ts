// API base configuration and utilities
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

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
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
