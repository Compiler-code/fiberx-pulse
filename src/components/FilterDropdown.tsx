import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterDropdownProps {
  selectedPlans: string[];
  selectedStatuses: string[];
  onPlanChange: (plans: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  availablePlans: string[];
}

export const FilterDropdown = ({
  selectedPlans,
  selectedStatuses,
  onPlanChange,
  onStatusChange,
  availablePlans,
}: FilterDropdownProps) => {
  const handlePlanToggle = (plan: string) => {
    if (selectedPlans.includes(plan)) {
      onPlanChange(selectedPlans.filter((p) => p !== plan));
    } else {
      onPlanChange([...selectedPlans, plan]);
    }
  };

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background" align="end">
        <DropdownMenuLabel>Filter by Plan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availablePlans.map((plan) => (
          <DropdownMenuCheckboxItem
            key={plan}
            checked={selectedPlans.includes(plan)}
            onCheckedChange={() => handlePlanToggle(plan)}
          >
            {plan}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes("Paid")}
          onCheckedChange={() => handleStatusToggle("Paid")}
        >
          Paid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedStatuses.includes("Pending")}
          onCheckedChange={() => handleStatusToggle("Pending")}
        >
          Pending
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
