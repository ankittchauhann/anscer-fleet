import QueryExample from "@/components/QueryExample";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/query-example")({
  component: QueryExample,
});
