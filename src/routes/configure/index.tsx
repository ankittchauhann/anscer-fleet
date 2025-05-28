import { createFileRoute } from "@tanstack/react-router";

import Robot from "@/components/configure/Robot";

export interface ConfigureSearchParams {
    // Search and filtering
    search?: string;
    status?: "ACTIVE" | "CHARGING" | "INACTIVE";
    type?: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    connectivity?: "CONNECTED" | "DISCONNECTED";
    location?: string;

    // Pagination
    page?: number;
    limit?: number;

    // Sorting
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    sort?: string;

    // Range filters
    minCharge?: number;
    maxCharge?: number;
}

export const Route = createFileRoute("/configure/")({
    component: Robot,
    validateSearch: (search): ConfigureSearchParams => {
        return {
            // Search and basic filters
            search:
                typeof search.search === "string" ? search.search : undefined,
            status:
                typeof search.status === "string" &&
                ["ACTIVE", "CHARGING", "INACTIVE"].includes(search.status)
                    ? (search.status as ConfigureSearchParams["status"])
                    : undefined,
            type:
                typeof search.type === "string" &&
                ["TUGGER", "CONVEYOR", "FORKLIFT"].includes(search.type)
                    ? (search.type as ConfigureSearchParams["type"])
                    : undefined,
            connectivity:
                typeof search.connectivity === "string" &&
                ["CONNECTED", "DISCONNECTED"].includes(search.connectivity)
                    ? (search.connectivity as ConfigureSearchParams["connectivity"])
                    : undefined,
            location:
                typeof search.location === "string"
                    ? search.location
                    : undefined,

            // Pagination
            page:
                typeof search.page === "number"
                    ? search.page
                    : typeof search.page === "string"
                      ? Number.parseInt(search.page, 10)
                      : undefined,
            limit:
                typeof search.limit === "number"
                    ? search.limit
                    : typeof search.limit === "string"
                      ? Number.parseInt(search.limit, 10)
                      : undefined,

            // Sorting
            sortBy:
                typeof search.sortBy === "string" ? search.sortBy : undefined,
            sortOrder:
                typeof search.sortOrder === "string" &&
                ["asc", "desc"].includes(search.sortOrder)
                    ? (search.sortOrder as "asc" | "desc")
                    : undefined,
            sort: typeof search.sort === "string" ? search.sort : undefined,

            // Range filters
            minCharge:
                typeof search.minCharge === "number"
                    ? search.minCharge
                    : typeof search.minCharge === "string"
                      ? Number.parseInt(search.minCharge, 10)
                      : undefined,
            maxCharge:
                typeof search.maxCharge === "number"
                    ? search.maxCharge
                    : typeof search.maxCharge === "string"
                      ? Number.parseInt(search.maxCharge, 10)
                      : undefined,
        };
    },
});
