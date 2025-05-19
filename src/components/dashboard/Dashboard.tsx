import { useState } from "react";
import RobotFilter from "./RobotFlter";

const DashboardScreen = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };
  return (
    <div className="h-[calc(100vh_-_64px)] flex flex-col bg-gray-100">
      <div className=" px-4 py-4 flex justify-between items-cente w-screen border-b border-gray-200 bg-white shadow-lg">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <RobotFilter
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          resetFilters={resetFilters}
        />
      </div>
      <div className="px-4 py-4 flex justify-center items-center w-screen flex-1  bg-gray-300 ">
        <p className="text-gray-900 text-3xl">Map Component</p>
      </div>
    </div>
  );
};

export default DashboardScreen;
