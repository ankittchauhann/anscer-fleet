// App.tsx
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./components/NotFound";
import { Provider } from "react-redux";
import { store } from "./store/store";

declare module "@tanstack/react-router" {
    interface Register {
        routes: typeof routeTree;
    }
}

function App() {
    const auth = useAuth();
    const queryClient = new QueryClient();

    // Create the router with correct context and memoize it
    const router = useMemo(() => {
        return createRouter({
            routeTree,
            context: { authentication: auth },
            defaultNotFoundComponent: NotFound,
        });
    }, [auth]);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <div className="">
                    <RouterProvider router={router} />
                </div>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
