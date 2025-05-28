import { apiRequest } from "./api";
import { buildQueryString } from "@/utils/queryBuilder";

// Updated Robot interface to match backend structure
export interface Robot {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    location: string;
    charge: number; // Changed from string to number (percentage)
    status: "ACTIVE" | "CHARGING" | "INACTIVE";
    connectivity: "CONNECTED" | "DISCONNECTED";
    lastSeen?: string; // ISO date string
    batteryHealth?: number; // 0-100 percentage
    firmware?: string;
    taskCount?: number;
}

// Backend robot response type (now with number charge)
interface BackendRobot {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    location: string;
    charge: number; // Backend now returns this as number (percentage)
    status: "ACTIVE" | "CHARGING" | "INACTIVE";
    connectivity: "CONNECTED" | "DISCONNECTED";
    lastSeen?: string;
    batteryHealth?: number;
    firmware?: string;
    taskCount?: number;
}

// Backend API response structure
interface BackendRobotsResponse {
    data: BackendRobot[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    count?: number;
}

// Transform backend robot to frontend robot
const transformRobot = (backendRobot: BackendRobot): Robot => ({
    ...backendRobot,
    charge: backendRobot.charge, // No transformation needed since charge is already a number
});

export interface RobotStats {
    total: number;
    active: number;
    charging: number;
    inactive: number;
    connected: number;
    disconnected: number;
    averageCharge: number;
}

export interface RobotsResponse {
    robots: Robot[];
    stats: RobotStats;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface RobotFilters {
    status?: Robot["status"];
    type?: Robot["type"];
    connectivity?: Robot["connectivity"];
    minCharge?: number;
    maxCharge?: number;
    location?: string;
    serialNumber?: string;
}

export interface RobotQueryParams extends RobotFilters {
    // Pagination
    page?: number;
    limit?: number;
    currentPage?: number;

    // Sorting (follows backend format: "field" or "-field" for desc)
    sort?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";

    // Search/filtering
    search?: string;
    fields?: string;

    // MongoDB-style filtering operators
    "charge[gte]"?: number; // charge >= value
    "charge[lte]"?: number; // charge <= value
    "charge[gt]"?: number; // charge > value
    "charge[lt]"?: number; // charge < value
    "status[in]"?: string; // status in array
    "type[in]"?: string; // type in array
    "connectivity[in]"?: string; // connectivity in array
    "location[regex]"?: string; // location regex search
    "serialNumber[regex]"?: string; // serial number regex search

    // Advanced filtering with MongoDB operators
    [key: string]: string | number | undefined;
}

// Robot API service functions
export const robotsApi = {
    // Get all robots with optional filtering and pagination
    getRobots: async (params?: RobotQueryParams): Promise<RobotsResponse> => {
        const queryString = buildQueryString(params || {});
        const endpoint = `/robots${queryString ? `?${queryString}` : ""}`;
        const response = await apiRequest<BackendRobotsResponse>(endpoint);

        const robots = response.data.map(transformRobot);

        // Calculate stats from robot data (use backend pagination info if available)
        const stats: RobotStats = {
            total: response.pagination?.totalCount || robots.length,
            active: robots.filter((r) => r.status === "ACTIVE").length,
            charging: robots.filter((r) => r.status === "CHARGING").length,
            inactive: robots.filter((r) => r.status === "INACTIVE").length,
            connected: robots.filter((r) => r.connectivity === "CONNECTED")
                .length,
            disconnected: robots.filter(
                (r) => r.connectivity === "DISCONNECTED"
            ).length,
            averageCharge:
                robots.length > 0
                    ? Math.round(
                          robots.reduce((sum, r) => sum + r.charge, 0) /
                              robots.length
                      )
                    : 0,
        };

        return {
            robots,
            stats,
            pagination: response.pagination
                ? {
                      page: response.pagination.currentPage,
                      limit: response.pagination.limit,
                      total: response.pagination.totalCount,
                      totalPages: response.pagination.totalPages,
                  }
                : undefined,
        };
    },

    // Get a single robot by serial number
    getRobot: async (serialNumber: string): Promise<Robot> => {
        const backendRobot = await apiRequest<BackendRobot>(
            `/robots/${serialNumber}`
        );
        return transformRobot(backendRobot);
    },

    // Update robot status or other properties
    updateRobot: async (
        serialNumber: string,
        updates: Partial<Robot>
    ): Promise<Robot> => {
        const backendRobot = await apiRequest<BackendRobot>(
            `/robots/${serialNumber}`,
            {
                method: "PATCH",
                body: JSON.stringify(updates),
            }
        );
        return transformRobot(backendRobot);
    },

    // Get robot statistics only
    getRobotStats: async (): Promise<RobotStats> => {
        // Get all robots to calculate stats (without pagination for accurate totals)
        const response = await apiRequest<BackendRobotsResponse>("/robots");
        const robots = response.data.map(transformRobot);

        return {
            total: robots.length,
            active: robots.filter((r) => r.status === "ACTIVE").length,
            charging: robots.filter((r) => r.status === "CHARGING").length,
            inactive: robots.filter((r) => r.status === "INACTIVE").length,
            connected: robots.filter((r) => r.connectivity === "CONNECTED")
                .length,
            disconnected: robots.filter(
                (r) => r.connectivity === "DISCONNECTED"
            ).length,
            averageCharge:
                robots.length > 0
                    ? Math.round(
                          robots.reduce((sum, r) => sum + r.charge, 0) /
                              robots.length
                      )
                    : 0,
        };
    },
};
