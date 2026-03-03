import React from "react";
import { DatePicker } from "./ui/date-picker";
import { format } from "date-fns";
import { Button } from "./ui/button";

interface CVDateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (updates: { startDate?: string; endDate?: string; dateRange: string }) => void;
}

const safeDate = (val?: string) => {
  if (!val) return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

const formatRange = (sDate?: Date, eDate?: Date) => {
  if (!sDate && !eDate) return "";
  const s = sDate ? format(sDate, "MMM yyyy") : "Unknown";
  const e = eDate ? format(eDate, "MMM yyyy") : "Present";
  return `${s} - ${e}`;
};

export function CVDateRangePicker({ startDate, endDate, onChange }: CVDateRangePickerProps) {
  const handleStartChange = (date?: Date) => {
    const newStart = date ? date.toISOString() : undefined;
    onChange({
      startDate: newStart,
      endDate,
      dateRange: formatRange(date, safeDate(endDate))
    });
  };

  const handleEndChange = (date?: Date) => {
    const newEnd = date ? date.toISOString() : undefined;
    onChange({
      startDate,
      endDate: newEnd,
      dateRange: formatRange(safeDate(startDate), date)
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <DatePicker
          date={safeDate(startDate)}
          setDate={handleStartChange}
          placeholder="Start Date"
        />
      </div>
      <span className="text-muted-foreground">-</span>
      <div className="flex-1">
        <DatePicker
          date={safeDate(endDate)}
          setDate={handleEndChange}
          placeholder="Present (No End Date)"
        />
      </div>
      {endDate && (
        <Button variant="ghost" size="sm" onClick={() => handleEndChange(undefined)} className="px-2 border">
          Clear
        </Button>
      )}
    </div>
  );
}
