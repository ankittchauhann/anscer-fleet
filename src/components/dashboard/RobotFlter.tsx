import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import { Filter } from "lucide-react";
import { useState } from "react";

const robotTypes = [
  { label: "Carrier", value: "CARRIER" },
  { label: "Conveyor", value: "CONVEYOR" },
  { label: "Tugger", value: "TUGGER" },
  { label: "Forklift", value: "FORKLIFT" },
];

const robotStatuses = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Error", value: "ERROR" },
  { label: "Charging", value: "CHARGING" },
];

// define the types for the props
type RobotFilterProps = {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  resetFilters: () => void;
};

// define the component
const RobotFilter = ({
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  resetFilters,
}: RobotFilterProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleStatusChange = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <div>
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-md border border-gray-300"
          >
            <Filter className="h-4 w-4" />
            <span>FILTER</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-6 mr-4 drop-shadow-lg">
          <div className="flex gap-6 ">
            <div className="space-y-4">
              <h3 className="font-medium">Type</h3>
              <div className="space-y-2">
                {robotTypes.map((type) => (
                  <div key={type.label} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value.toLowerCase()}
                      checked={selectedTypes.includes(type.value)}
                      onCheckedChange={() => handleTypeChange(type.value)}
                      style={{ cursor: "pointer", borderRadius: "2px" }}
                    />
                    <Label htmlFor={type.label.toLowerCase()}>
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Status</h3>
              <div className="space-y-2">
                {robotStatuses.map((status) => (
                  <div
                    key={status.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={status.value.toLowerCase()}
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={() => handleStatusChange(status.value)}
                      style={{ cursor: "pointer", borderRadius: "2px" }}
                    />
                    <Label htmlFor={status.value.toLowerCase()}>
                      {status.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetFilters();
                setFilterOpen(false);
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RobotFilter;
