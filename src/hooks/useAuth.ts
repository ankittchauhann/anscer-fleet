// hooks/useAuth.ts - Session-based authentication
import { useState, useEffect } from "react";
import {
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    getCurrentSession,
    ApiError,
    type User,
    type LoginRequest,
    type SignUpRequest,
} from "@/services/auth";
import { showToast } from "@/lib/toast";

interface AuthSession {
    user: User;
    session: { id: string; expiresAt: string };
}

export interface AuthState {
    user: User | null;
    session: { id: string; expiresAt: string } | null;
    isAuthenticated: boolean;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        isAuthenticated: false,
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize session on mount
    useEffect(() => {
        const initializeSession = async () => {
            try {
                const sessionData: AuthSession | null =
                    await getCurrentSession();
                if (sessionData) {
                    setAuthState({
                        user: sessionData.user,
                        session: sessionData.session,
                        isAuthenticated: true,
                    });
                } else {
                    setAuthState({
                        user: null,
                        session: null,
                        isAuthenticated: false,
                    });
                }
            } catch (error) {
                console.error("Failed to initialize session:", error);
                setAuthState({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                });
            } finally {
                setIsInitialized(true);
            }
        };

        initializeSession();
    }, []);

    // Check if user is authenticated
    const isLogged = (): boolean => {
        return authState.isAuthenticated && !!authState.user;
    };

    // Get current user
    const getUser = (): User | null => {
        return authState.user;
    };

    // Get user email
    const getEmail = (): string => {
        return authState.user?.email || "";
    };

    // Get session (for compatibility)
    const getToken = (): string | null => {
        // Return session ID for compatibility, though not needed anymore
        return authState.session?.id || null;
    };

    // Sign in with email/password
    const signIn = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const credentials: LoginRequest = { email, password };
            const sessionData: AuthSession = await signInWithEmail(credentials);

            // Update auth state
            setAuthState({
                user: sessionData.user,
                session: sessionData.session,
                isAuthenticated: true,
            });

            // Show success notification
            showToast.success(
                "Welcome back!",
                `Successfully signed in as ${sessionData.user.name}`
            );

            // Navigate to home page
            window.location.href = "/";
            return true;
        } catch (err) {
            let errorMessage = "Login failed. Please try again.";

            if (err instanceof ApiError) {
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

            // Show error notification
            showToast.error("Sign In Failed", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Sign up with email/password/name
    const signUp = async (
        email: string,
        password: string,
        name: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const userData: SignUpRequest = { email, password, name };
            const sessionData: AuthSession = await signUpWithEmail(userData);

            // Update auth state
            setAuthState({
                user: sessionData.user,
                session: sessionData.session,
                isAuthenticated: true,
            });

            // Show success notification
            showToast.success(
                "Account Created!",
                `Welcome ${sessionData.user.name}! Your account has been created successfully.`
            );

            // Navigate to home page
            window.location.href = "/";
            return true;
        } catch (err) {
            let errorMessage = "Registration failed. Please try again.";

            if (err instanceof ApiError) {
                errorMessage = err.message;

                if (!errorMessage || errorMessage.includes("HTTP")) {
                    if (err.status === 400) {
                        errorMessage = "Invalid registration data";
                    } else if (err.status === 409) {
                        errorMessage = "Email already exists";
                    } else if (err.status === 0) {
                        errorMessage =
                            "Network error. Please check your connection.";
                    }
                }
            } else {
                errorMessage =
                    err instanceof Error ? err.message : errorMessage;
            }

            // Show error notification
            showToast.error("Registration Failed", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Sign out
    const signOut = async () => {
        try {
            await signOutUser();

            // Show success notification
            showToast.success(
                "Signed Out",
                "You have been successfully signed out."
            );
        } catch (error) {
            console.error("Sign out error:", error);
            // Show error notification but still proceed with logout
            showToast.warning(
                "Sign Out",
                "There was an issue signing out from the server, but you have been logged out locally."
            );
        } finally {
            // Always clear local state regardless of API call result
            setAuthState({
                user: null,
                session: null,
                isAuthenticated: false,
            });
            setError(null);
            window.location.href = "/login";
        }
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    // Refresh session
    const refreshSession = async () => {
        try {
            const sessionData: AuthSession | null = await getCurrentSession();
            if (sessionData) {
                setAuthState({
                    user: sessionData.user,
                    session: sessionData.session,
                    isAuthenticated: true,
                });
            } else {
                setAuthState({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                });
            }
        } catch (error) {
            console.error("Failed to refresh session:", error);
            setAuthState({
                user: null,
                session: null,
                isAuthenticated: false,
            });
        }
    };

    return {
        // Auth actions
        signIn,
        signUp,
        signOut,
        refreshSession,

        // State getters (for compatibility)
        isLogged,
        getEmail,
        getUser,
        getToken,

        // Loading and error states
        isLoading,
        error,
        clearError,

        // New session-based properties
        authState,
        isInitialized,
    };
};

export type AuthContext = ReturnType<typeof useAuth>;
