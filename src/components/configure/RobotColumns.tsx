"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Robot } from "@/services/robots";

// Status badge component
const StatusBadge = ({ status }: { status: Robot["status"] }) => {
    const getStatusColor = (status: Robot["status"]) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-800 border-green-200";
            case "CHARGING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "INACTIVE":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                status
            )}`}
        >
            {status}
        </span>
    );
};

// Connectivity badge component
const ConnectivityBadge = ({
    connectivity,
}: {
    connectivity: Robot["connectivity"];
}) => {
    const getConnectivityColor = (connectivity: Robot["connectivity"]) => {
        switch (connectivity) {
            case "CONNECTED":
                return "bg-green-100 text-green-800 border-green-200";
            case "DISCONNECTED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getConnectivityColor(
                connectivity
            )}`}
        >
            {connectivity}
        </span>
    );
};

// Type badge component
const TypeBadge = ({ type }: { type: Robot["type"] }) => {
    const getTypeColor = (type: Robot["type"]) => {
        switch (type) {
            case "TUGGER":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "CONVEYOR":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "FORKLIFT":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                type
            )}`}
        >
            {type}
        </span>
    );
};

// Charge indicator component
const ChargeIndicator = ({ charge }: { charge: number }) => {
    const chargeValue = charge; // charge is already a number from API transformation

    const getChargeColor = (value: number) => {
        if (value >= 70) return "bg-green-500";
        if (value >= 30) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${getChargeColor(chargeValue)}`}
                    style={{ width: `${chargeValue}%` }}
                />
            </div>
            <span className="text-sm font-medium">{charge}%</span>
        </div>
    );
};

export const columns: ColumnDef<Robot>[] = [
    {
        accessorKey: "serialNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Serial Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-mono font-medium">
                {row.getValue("serialNumber")}
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <TypeBadge type={row.getValue("type")} />,
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("location")}</div>
        ),
    },
    {
        accessorKey: "charge",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Charge
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <ChargeIndicator charge={row.getValue("charge")} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
        accessorKey: "connectivity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Connectivity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <ConnectivityBadge connectivity={row.getValue("connectivity")} />
        ),
    },
];
