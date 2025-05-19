import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/monitor/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <p>
        <span className="text-2xl font-bold">Monitor</span>
        <br />
        <span className="text-gray-500">
          Monitor the status of your devices and services.
        </span>
        <Outlet />
      </p>
    </div>
  );
}
