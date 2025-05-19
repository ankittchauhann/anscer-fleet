import { createFileRoute } from "@tanstack/react-router";

import Robot from "@/components/configure/Robot";

export const Route = createFileRoute("/configure/")({
  component: Robot,
});
