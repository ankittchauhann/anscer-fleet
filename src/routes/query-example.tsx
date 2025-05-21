import QueryExample from "@/components/QueryExample";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/query-example")({
    component: QueryExample,
    validateSearch: (search) => {
        return {
            id: typeof search.id === "string" ? search.id : undefined,
        };
    },
});
