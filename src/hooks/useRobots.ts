import { useState, useMemo } from "react";

export interface Robot {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    location: string;
    charge: string;
    status: "ACTIVE" | "CHARGING" | "INACTIVE";
    connectivity: "CONNECTED" | "DISCONNECTED";
}

// Mock data for robots
const mockRobots: Robot[] = [
    {
        serialNumber: "AR001",
        type: "TUGGER",
        location: "Waypoint 1",
        charge: "85%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR002",
        type: "CONVEYOR",
        location: "Waypoint 3",
        charge: "45%",
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR003",
        type: "FORKLIFT",
        location: "Waypoint 2",
        charge: "92%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR004",
        type: "TUGGER",
        location: "Waypoint 5",
        charge: "12%",
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR005",
        type: "CONVEYOR",
        location: "Waypoint 4",
        charge: "78%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR006",
        type: "FORKLIFT",
        location: "Waypoint 6",
        charge: "23%",
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR007",
        type: "TUGGER",
        location: "Waypoint 7",
        charge: "67%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR008",
        type: "CONVEYOR",
        location: "Waypoint 8",
        charge: "3%",
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
];

export const useRobots = () => {
    const [robots] = useState<Robot[]>(mockRobots);

    const robotStats = useMemo(() => {
        const total = robots.length;
        const active = robots.filter((r) => r.status === "ACTIVE").length;
        const charging = robots.filter((r) => r.status === "CHARGING").length;
        const inactive = robots.filter((r) => r.status === "INACTIVE").length;
        const connected = robots.filter(
            (r) => r.connectivity === "CONNECTED"
        ).length;

        return {
            total,
            active,
            charging,
            inactive,
            connected,
            disconnected: total - connected,
        };
    }, [robots]);

    return {
        robots,
        robotStats,
    };
};
