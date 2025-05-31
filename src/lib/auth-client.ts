// Better-Auth client configuration
import { createAuthClient } from "better-auth/react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";

export const authClient = createAuthClient({
    baseURL: API_BASE_URL,
    // This ensures cookies are included in all requests
    credentials: "include",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
