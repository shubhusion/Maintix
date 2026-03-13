'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  placeholder?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date range',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatDateRange = () => {
    if (!date?.from) return placeholder;
    
    const from = format(date.from, 'MMM dd, yyyy');
    if (!date.to) return from;
    
    const to = format(date.to, 'MMM dd, yyyy');
    return `${from} - ${to}`;
  };

  const handleSelect = (selectedDate: DateRange | undefined) => {
    onDateChange(selectedDate);
    // Keep popover open for range selection
    if (selectedDate?.from && !selectedDate?.to) {
      return;
    }
    setOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full sm:w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
