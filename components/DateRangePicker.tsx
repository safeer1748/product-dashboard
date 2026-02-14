'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, DayButtonProps, useDayRender } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

interface DateRangePickerProps {
    className?: string;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
    className,
    date,
    setDate,
}: DateRangePickerProps) {

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal cursor-pointer',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        components={{
                            DayButton: CustomDayButton
                        }}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

function CustomDayButton(props: DayButtonProps) {
    const { day, modifiers, className, ...buttonProps } = props

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
                <button
                    {...buttonProps}
                    type="button"
                    className={cn(
                        "cursor-pointer",
                        "relative h-9 w-9 p-0 font-normal rounded-md",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

                        // ✅ hover
                        "hover:bg-accent hover:text-accent-foreground",

                        // ✅ start & end
                        "aria-selected:bg-primary aria-selected:text-primary-foreground",
                        "aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground",

                        // ✅ 🔥 RANGE MIDDLE (THIS WAS MISSING)
                        modifiers.range_middle &&
                        "bg-accent text-accent-foreground rounded-none",

                        // ✅ optional polish
                        modifiers.range_start && "rounded-l-md bg-primary",
                        modifiers.range_end && "rounded-r-md bg-primary",

                        modifiers.today && "border border-primary",
                        className
                    )}
                >
                    <time dateTime={day.date.toISOString()}>
                        {day.date.getDate()}
                    </time>
                </button>
            </HoverCardTrigger>

            <HoverCardContent
                side="top"
                className="bg-primary text-white w-auto p-2 text-xs font-medium shadow-md pointer-events-none"
            >
                {day.date.toDateString()}
            </HoverCardContent>
        </HoverCard>
    )
}


