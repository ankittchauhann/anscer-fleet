// Protected Route component
import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
    const { isLogged } = useAuth();

    if (!isLogged()) {
        return (
            fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">
                            Access Denied
                        </h2>
                        <p className="mb-6 text-gray-600">
                            You need to be logged in to access this page.
                        </p>
                        <Button
                            onClick={() => (window.location.href = "/login")}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
};

// Higher-order component for role-based access
interface RoleProtectedRouteProps extends ProtectedRouteProps {
    allowedRoles: string[];
}

export const RoleProtectedRoute = ({
    children,
    allowedRoles,
    fallback,
}: RoleProtectedRouteProps) => {
    const { isLogged, getUser, signOut } = useAuth();
    const user = getUser();

    if (!isLogged()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">
                        Access Denied
                    </h2>
                    <p className="mb-6 text-gray-600">
                        You need to be logged in to access this page.
                    </p>
                    <Button
                        onClick={() => (window.location.href = "/login")}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    if (user && !allowedRoles.includes(user.role)) {
        return (
            fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-orange-600">
                            Insufficient Permissions
                        </h2>
                        <p className="mb-4 text-gray-600">
                            You don't have permission to access this page.
                        </p>
                        <p className="mb-6 text-sm text-gray-500">
                            Your role:{" "}
                            <span className="font-semibold capitalize">
                                {user.role}
                            </span>
                            <br />
                            Required roles:{" "}
                            <span className="font-semibold">
                                {allowedRoles.join(", ")}
                            </span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="flex-1"
                            >
                                Go Back
                            </Button>
                            <Button onClick={signOut} className="flex-1">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )
        );
    }

    return <>{children}</>;
};
