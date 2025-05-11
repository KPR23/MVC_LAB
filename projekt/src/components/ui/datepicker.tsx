'use client';

import * as React from 'react';
import { format, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { DateRange } from 'react-day-picker';
import { Calendar } from './calendar';

interface DatePickerWithRangeProps {
  className?: string;
  date?: DateRange;
  onSelect?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onSelect,
}: DatePickerWithRangeProps) {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
    date
  );

  const handleSelect = (newDate: DateRange | undefined) => {
    if (newDate?.from) {
      // Create new dates and adjust for timezone
      const from = new Date(newDate.from);
      from.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

      let to: Date | undefined;
      if (newDate.to) {
        to = new Date(newDate.to);
        to.setHours(12, 0, 0, 0);
      }

      setSelectedDate({ from, to });
      onSelect?.({ from, to });
    } else {
      setSelectedDate(undefined);
      onSelect?.(undefined);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <>
                  {format(selectedDate.from, 'd MMMM yyyy', { locale: pl })} -{' '}
                  {format(selectedDate.to, 'd MMMM yyyy', { locale: pl })}
                </>
              ) : (
                format(selectedDate.from, 'd MMMM yyyy', { locale: pl })
              )
            ) : (
              <span>Wybierz datę wydarzenia</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={selectedDate}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={pl}
            disabled={{ before: new Date() }}
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
