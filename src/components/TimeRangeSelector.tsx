import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type TimeRange = "today" | "week" | "month" | "year" | "lifetime" | "custom";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  customDateRange?: { from: Date; to: Date };
  onCustomDateChange?: (from: Date, to: Date) => void;
}

export const TimeRangeSelector = ({
  value,
  onChange,
  customDateRange,
  onCustomDateChange,
}: TimeRangeSelectorProps) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(customDateRange?.from);
  const [dateTo, setDateTo] = useState<Date | undefined>(customDateRange?.to);

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
    { label: "Lifetime", value: "lifetime" },
    { label: "Custom", value: "custom" },
  ];

  const handleCustomApply = () => {
    if (dateFrom && dateTo && onCustomDateChange) {
      onCustomDateChange(dateFrom, dateTo);
      onChange("custom");
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {timeRanges.map((range) =>
        range.value === "custom" ? (
          <Popover key={range.value} open={showCustomPicker} onOpenChange={setShowCustomPicker}>
            <PopoverTrigger asChild>
              <Button
                variant={value === range.value ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <CalendarIcon className="h-3 w-3" />
                {range.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">From Date</p>
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">To Date</p>
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </div>
                <Button
                  onClick={handleCustomApply}
                  className="w-full"
                  disabled={!dateFrom || !dateTo}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            key={range.value}
            variant={value === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(range.value)}
          >
            {range.label}
          </Button>
        )
      )}
    </div>
  );
};
