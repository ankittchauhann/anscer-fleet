import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { User } from "@/services/auth";

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-100 text-red-800 border-red-200";
            case "operator":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "user":
                return "bg-green-100 text-green-800 border-green-200";
            case "viewer":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getRoleColor(
                role
            )}`}
        >
            {role}
        </span>
    );
};

// Status badge component
const StatusBadge = ({ isActive }: { isActive: boolean }) => {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isActive
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
            }`}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
};

// Date formatter component
const DateDisplay = ({ date }: { date: string }) => {
    const formatted = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return <span className="text-sm text-gray-600">{formatted}</span>;
};

// Export function to get columns (Fast Refresh compatible)
export const getUserColumns = (): ColumnDef<User>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-mono text-sm">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
    },
    {
        accessorKey: "isActive",
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
        cell: ({ row }) => <StatusBadge isActive={row.getValue("isActive")} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <DateDisplay date={row.getValue("createdAt")} />,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 h-auto font-medium"
                >
                    Updated
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <DateDisplay date={row.getValue("updatedAt")} />,
    },
];

// Legacy export for backward compatibility
export const columns = getUserColumns();
