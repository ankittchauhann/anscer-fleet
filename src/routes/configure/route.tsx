import ConfigureScreen from "@/components/configure/Configure";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/configure")({
  component: ConfigureScreen,
});
