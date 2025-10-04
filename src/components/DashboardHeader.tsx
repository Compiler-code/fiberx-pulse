import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from "./FilterDropdown";

interface DashboardHeaderProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  selectedPlans: string[];
  selectedStatuses: string[];
  onPlanChange: (plans: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  availablePlans: string[];
}

export const DashboardHeader = ({
  onExportExcel,
  onExportPDF,
  selectedPlans,
  selectedStatuses,
  onPlanChange,
  onStatusChange,
  availablePlans,
}: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="px-4 sm:px-8 py-4 flex items-center justify-end gap-2 flex-wrap">
        <FilterDropdown
          selectedPlans={selectedPlans}
          selectedStatuses={selectedStatuses}
          onPlanChange={onPlanChange}
          onStatusChange={onStatusChange}
          availablePlans={availablePlans}
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-2 flex-1 sm:flex-none"
          onClick={onExportExcel}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 flex-1 sm:flex-none"
          onClick={onExportPDF}
        >
          <Download className="h-4 w-4" />
          PDF
        </Button>
      </div>
    </header>
  );
};
