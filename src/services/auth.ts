// Authentication API service - Session-based (Better-Auth)
const AUTH_BASE_URL = "http://localhost:5005";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role?: string; // Optional for backward compatibility, may be added by better-auth plugins
    createdAt: string;
    updatedAt: string;
}

export interface AuthSession {
    user: User;
    session: {
        id: string;
        expiresAt: string;
    };
}

export interface ApiErrorResponse {
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

// Sign in with email/password (session-based)
export const signInWithEmail = async (
    credentials: LoginRequest
): Promise<AuthSession> => {
    const url = `${AUTH_BASE_URL}/api/auth/sign-in/email`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage =
                data.message ||
                data.error ||
                `HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(response.status, errorMessage, response);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            0,
            error instanceof Error ? error.message : "Unknown error occurred"
        );
    }
};

// Sign up with email/password (session-based)
export const signUpWithEmail = async (
    userData: SignUpRequest
): Promise<AuthSession> => {
    const url = `${AUTH_BASE_URL}/api/auth/sign-up/email`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage =
                data.message ||
                data.error ||
                `HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(response.status, errorMessage, response);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            0,
            error instanceof Error ? error.message : "Unknown error occurred"
        );
    }
};

// Sign out (session-based)
export const signOutUser = async (): Promise<void> => {
    const url = `${AUTH_BASE_URL}/api/auth/sign-out`;

    try {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies
            body: JSON.stringify({}),
        });
        // Don't throw error even if request fails - always clear local state
    } catch (error) {
        // Ignore errors - always proceed with logout
        console.warn("Sign out request failed:", error);
    }
};

// Get current session
export const getCurrentSession = async (): Promise<AuthSession | null> => {
    const url = `${AUTH_BASE_URL}/api/auth/get-session`;

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include", // Include cookies
        });

        if (!response.ok) {
            // If unauthorized, return null (not signed in)
            if (response.status === 401) {
                return null;
            }
            throw new ApiError(
                response.status,
                `HTTP ${response.status}: ${response.statusText}`,
                response
            );
        }

        const data = await response.json();
        return data; // Could be null if no session
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Network errors - assume not authenticated
        return null;
    }
};
