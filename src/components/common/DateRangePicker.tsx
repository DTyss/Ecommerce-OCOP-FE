import * as React from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/utils";
import { format, differenceInCalendarDays, startOfDay, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export interface DateRangePickerProps {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  className?: string;
}

export function DateRangePicker({ className, value, onChange, onBlur }: DateRangePickerProps) {
  const today = startOfDay(new Date());

  // Uncontrolled internal state fallback
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(value);

  const date = value ?? internalDate ?? { from: today, to: today };

  const fmt = (d?: Date) => (d ? `${format(d, "dd/MM/yyyy")}` : "");

  const setDate = (next: DateRange | undefined) => {
    setInternalDate(next);
    onChange?.(next);
  };

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected) {
      setDate(undefined);
      return;
    }

    if (selected.from && !selected.to) {
      const from = selected.from;

      setDate({ from });
      return;
    }

    if (selected.from && selected.to) {
      let from = selected.from;
      let to = selected.to;
      if (to < from) {
        const tmp = from;
        from = to;
        to = tmp;
      }
      const days = differenceInCalendarDays(to, from);
      if (days > 30) {
        to = addDays(from, 30);
      }
      setDate({ from, to });
      return;
    }

    setDate(selected);
  };

  const disabled: Matcher | Matcher[] | undefined = React.useMemo(() => {
    if (date.from) {
      const max = addDays(date.from, 30);
      return { before: date.from, after: max };
    }
    return undefined;
  }, [date.from]);

  return (
    <div className={cn("grid w-full gap-2", className)}>
      <div className="text-muted-foreground mb-1.5 text-sm">Chọn ngày</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            onBlur={onBlur}
            className={cn(
              "h-auto w-full justify-start rounded-lg border border-gray-300 px-4 py-2.5 text-left text-base leading-6 font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {date.from ? (
              date.to ? (
                <>
                  {fmt(date.from)} - {fmt(date.to)}
                </>
              ) : (
                fmt(date.from)
              )
            ) : (
              fmt(new Date())
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-lg border border-gray-300 bg-white p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from ?? new Date()}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabled}
            classNames={{
              today:
                "relative text-orange-500 rounded-md after:content-[''] after:absolute after:bottom-0.5 after:right-1/2 after:translate-x-1/2 after:w-1 after:h-1 after:bg-orange-500 after:rounded-full",
              range_start: "text-orange-800 rounded-l-md",
              range_end: "bg-orange-500 text-white rounded-r-md",
              range_middle: "bg-orange-100 text-orange-800 rounded-none",
              selected: "bg-orange-100 text-black rounded-md",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
