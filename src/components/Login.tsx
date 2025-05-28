import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
    const { signIn, isLoading, error, clearError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        clearError();
        await signIn(data.email, data.password);
    };

    // Clear errors when user starts typing
    const handleInputChange = () => {
        if (error) clearError();
    };

    // if (isLogged()) {
    //     const user = getUser();
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //             <div className="bg-white p-8 rounded shadow-md w-80 flex flex-col items-center">
    //                 <h2 className="text-2xl font-bold mb-6 text-center">
    //                     Welcome
    //                 </h2>
    //                 <p className="mb-2">
    //                     <span className="font-semibold">Name:</span>{" "}
    //                     {user?.name}
    //                 </p>
    //                 <p className="mb-2">
    //                     <span className="font-semibold">Email:</span>{" "}
    //                     <span className="font-mono">{user?.email}</span>
    //                 </p>
    //                 <p className="mb-4">
    //                     <span className="font-semibold">Role:</span>{" "}
    //                     <span className="capitalize">{user?.role}</span>
    //                 </p>
    //                 <Button onClick={signOut} className="w-full mb-2">
    //                     Logout
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Display login errors */}
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
                        {...register("email")}
                        className="mt-1"
                        autoComplete="email"
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="mt-1"
                        autoComplete="current-password"
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Login"}
                </Button>

                {/* Development hint */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-700 text-xs">
                        <strong>Development:</strong> Make sure your backend
                        server is running on the configured API URL.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
