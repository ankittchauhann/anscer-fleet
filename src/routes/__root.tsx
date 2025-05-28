import {
    createRootRouteWithContext,
    Link,
    Outlet,
    redirect,
} from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import type { AuthContext } from "@/hooks/useAuth";
import { User } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type RouterContext = {
    authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    beforeLoad: ({ context, location }) => {
        const { isLogged } = context.authentication;
        // Allow unauthenticated access to /login
        if (location.pathname === "/login") return;
        if (!isLogged()) {
            throw redirect({
                to: "/login",
            });
        }
    },
    component: () => {
        const { isLogged, getEmail, signOut } = useAuth();
        return (
            <div>
                {isLogged() && (
                    <div className="h-[64px]">
                        <ul className="flex space-x-4 bg-primary p-4 items-center ">
                            <li className="flex-1">
                                <Link to="/">
                                    <img
                                        src="/AnscerNavbarLogo.png"
                                        alt="Anscer Logo"
                                        className="anscer-logo"
                                        style={{ height: "30px" }}
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-100 [&.active]:text-active-nav [&.active]:font-bold [&.active]:after:content-[''] [&.active]:after:block [&.active]:after:h-[2px] [&.active]:after:bg-active-nav [&.active]:after:mt-1"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/configure"
                                    className="text-gray-100 [&.active]:text-active-nav [&.active]:font-bold [&.active]:after:content-[''] [&.active]:after:block [&.active]:after:h-[2px] [&.active]:after:bg-active-nav [&.active]:after:mt-1"
                                >
                                    Configure
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/fleet"
                                    className="text-gray-100 [&.active]:text-active-nav [&.active]:font-bold [&.active]:after:content-[''] [&.active]:after:block [&.active]:after:h-[2px] [&.active]:after:bg-active-nav [&.active]:after:mt-1"
                                >
                                    Fleet
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/analytics"
                                    className="text-gray-100 [&.active]:text-active-nav [&.active]:font-bold [&.active]:after:content-[''] [&.active]:after:block [&.active]:after:h-[2px] [&.active]:after:bg-active-nav [&.active]:after:mt-1"
                                >
                                    Analytics
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/monitor"
                                    className="text-gray-100 [&.active]:text-active-nav [&.active]:font-bold [&.active]:after:content-[''] [&.active]:after:block [&.active]:after:h-[2px] [&.active]:after:bg-active-nav [&.active]:after:mt-1"
                                >
                                    Monitor
                                </Link>
                            </li>
                            {/* User Icon Dropdown */}
                            <li>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-200 hover:bg-primary hover:text-gray-200 hover:cursor-pointer"
                                        >
                                            <User className="w-8 h-8" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="end"
                                        className="w-56"
                                    >
                                        <div className="flex flex-col items-start gap-2 p-2">
                                            <span className="text-sm text-gray-700 font-medium">
                                                {getEmail()}
                                            </span>
                                            <Button
                                                variant="outline"
                                                className="w-full mt-2"
                                                onClick={signOut}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </li>
                        </ul>
                    </div>
                )}
                <Outlet />
                <TanStackRouterDevtools />
                <ReactQueryDevtools initialIsOpen={false} />
            </div>
        );
    },
});
