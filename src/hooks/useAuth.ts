// hooks/useAuth.ts
import { useState } from "react";
import {
    loginUser,
    getStoredToken,
    setStoredToken,
    removeStoredToken,
    getStoredUser,
    setStoredUser,
    removeStoredUser,
    isTokenValid,
    ApiError,
    type User,
    type LoginRequest,
} from "@/services/auth";

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is authenticated
    const isLogged = (): boolean => {
        const token = getStoredToken();
        const user = getStoredUser();
        return !!(token && user && isTokenValid(token));
    };

    // Get current user
    const getUser = (): User | null => {
        return getStoredUser();
    };

    // Get user email
    const getEmail = (): string => {
        const user = getStoredUser();
        return user?.email || "";
    };

    // Get auth token
    const getToken = (): string | null => {
        return getStoredToken();
    };

    // Sign in with backend API
    const signIn = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const credentials: LoginRequest = { email, password };
            const response = await loginUser(credentials);

            if (response.success) {
                // Store auth data
                setStoredToken(response.data.token);
                setStoredUser(response.data.user);

                // Navigate to home page
                window.location.href = "/";
                return true;
            }

            setError("Login failed");
            return false;
        } catch (err) {
            let errorMessage = "Login failed. Please try again.";

            if (err instanceof ApiError) {
                // Use the error message directly from the backend
                errorMessage = err.message;

                // Fallback to specific messages for HTTP status codes if needed
                if (!errorMessage || errorMessage.includes("HTTP")) {
                    if (err.status === 401) {
                        errorMessage = "Invalid email or password";
                    } else if (err.status === 403) {
                        errorMessage = "Account is deactivated";
                    } else if (err.status === 0) {
                        errorMessage =
                            "Network error. Please check your connection.";
                    }
                }
            } else {
                errorMessage =
                    err instanceof Error ? err.message : errorMessage;
            }

            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Sign out
    const signOut = () => {
        removeStoredToken();
        removeStoredUser();
        setError(null);
        window.location.href = "/login";
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    return {
        signIn,
        signOut,
        isLogged,
        getEmail,
        getUser,
        getToken,
        isLoading,
        error,
        clearError,
    };
};

export type AuthContext = ReturnType<typeof useAuth>;
