import UserScreen from "@/components/configure/User";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/configure/user")({
  component: UserScreen,
});
