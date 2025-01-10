import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateFilterProps {
  onFilterChange: (month: string, year: string) => void;
  filterVaue: { month: string; year: string };
}

export function DateFilter({
  onFilterChange,
  filterVaue,
}: Readonly<DateFilterProps>) {
  const { month, year } = filterVaue;

  const handleMonthChange = (value: string) => {
    onFilterChange(value, year);
  };

  const handleYearChange = (value: string) => {
    onFilterChange(month, value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="month-filter">Month:</Label>
        <Select value={month} onValueChange={handleMonthChange}>
          <SelectTrigger id="month-filter" className="w-[120px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <SelectItem key={m} value={m.toString().padStart(2, "0")}>
                {new Date(2000, m - 1, 1).toLocaleString("default", {
                  month: "long",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="year-filter">Year:</Label>
        <Select value={year} onValueChange={handleYearChange}>
          <SelectTrigger id="year-filter" className="w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
