// App.tsx
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./components/NotFound";

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
    <QueryClientProvider client={queryClient}>
      {/* <h1 className="mb-10 text-2xl font-extrabold">Tanstack Router</h1> */}
      <div className="">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
