import { useRobots } from "@/hooks/useRobots";
import { DataTable } from "./DataTable";
import { columns } from "./RobotColumns";

const RobotScreen = () => {
    const { robots, robotStats } = useRobots();

    return (
        <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Robot Fleet Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Monitor and manage your robot fleet configuration and
                    status.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Robots
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {robotStats.total}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">
                                T
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {robotStats.active}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm font-bold">
                                A
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Charging
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {robotStats.charging}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-sm font-bold">
                                C
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Connected
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {robotStats.connected}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">
                                N
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-6 pb-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Robot Fleet
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Comprehensive view of all robots in your fleet
                    </p>
                </div>
                <div className="flex-1 overflow-hidden">
                    <DataTable columns={columns} data={robots} />
                </div>
            </div>
        </div>
    );
};

export default RobotScreen;
