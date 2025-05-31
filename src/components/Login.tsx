import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

const Login = () => {
    const { signIn, signUp, isLoading, error, clearError } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const loginForm = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const signUpForm = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onLoginSubmit = async (data: LoginForm) => {
        clearError();
        await signIn(data.email, data.password);
    };

    const onSignUpSubmit = async (data: SignUpForm) => {
        clearError();
        await signUp(data.email, data.password, data.name);
    };

    // Clear errors when user starts typing
    const handleInputChange = () => {
        if (error) clearError();
    };

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        clearError();
        loginForm.reset();
        signUpForm.reset();
    };

    if (isSignUpMode) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <form
                    onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                    className="bg-white p-8 rounded shadow-md w-80"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Sign Up
                    </h2>

                    {/* Display auth errors */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            {...signUpForm.register("name")}
                            className="mt-1"
                            autoComplete="name"
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {signUpForm.formState.errors.name && (
                            <p className="text-red-600 text-sm mt-1">
                                {signUpForm.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...signUpForm.register("email")}
                            className="mt-1"
                            autoComplete="email"
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {signUpForm.formState.errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {signUpForm.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...signUpForm.register("password")}
                            className="mt-1"
                            autoComplete="new-password"
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {signUpForm.formState.errors.password && (
                            <p className="text-red-600 text-sm mt-1">
                                {signUpForm.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mb-4"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            disabled={isLoading}
                        >
                            Already have an account? Login
                        </button>
                    </div>

                    {/* Development hint */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-700 text-xs">
                            <strong>Development:</strong> Make sure your backend
                            server is running on http://localhost:5005 with
                            session-based auth.
                        </p>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="bg-white p-8 rounded shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Display auth errors */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...loginForm.register("email")}
                        className="mt-1"
                        autoComplete="email"
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    {loginForm.formState.errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {loginForm.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...loginForm.register("password")}
                        className="mt-1"
                        autoComplete="current-password"
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    {loginForm.formState.errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {loginForm.formState.errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mb-4"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Login"}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={isLoading}
                    >
                        Don't have an account? Sign up
                    </button>
                </div>

                {/* Development hint */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-xs">
                        <strong>✅ Ready:</strong> Session-based authentication
                        configured.
                        <br />
                        Backend CORS and session endpoints are working
                        correctly.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
