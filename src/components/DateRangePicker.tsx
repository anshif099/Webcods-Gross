import { useState } from 'react';
import { DateRange as DateRangeType } from '@/types/finance';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getDateRangeLabel } from '@/utils/dateUtils';

interface DateRangePickerProps {
    dateRange: DateRangeType;
    onDateRangeChange: (dateRange: DateRangeType) => void;
}

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<Date | undefined>(
        dateRange.startDate || undefined
    );
    const [tempEndDate, setTempEndDate] = useState<Date | undefined>(
        dateRange.endDate || undefined
    );
    const [selectingStart, setSelectingStart] = useState(true);

    const handleClear = () => {
        onDateRangeChange({ startDate: null, endDate: null });
        setTempStartDate(undefined);
        setTempEndDate(undefined);
        setSelectingStart(true);
        setIsOpen(false);
    };

    const handleApply = () => {
        onDateRangeChange({
            startDate: tempStartDate || null,
            endDate: tempEndDate || null,
        });
        setIsOpen(false);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        if (selectingStart) {
            setTempStartDate(date);
            setSelectingStart(false);
            // If there's an end date and the new start is after it, clear end date
            if (tempEndDate && date > tempEndDate) {
                setTempEndDate(undefined);
            }
        } else {
            // If selecting end date and it's before start, swap them
            if (tempStartDate && date < tempStartDate) {
                setTempEndDate(tempStartDate);
                setTempStartDate(date);
            } else {
                setTempEndDate(date);
            }
        }
    };

    const hasActiveRange = dateRange.startDate !== null || dateRange.endDate !== null;
    const rangeLabel = getDateRangeLabel(dateRange.startDate, dateRange.endDate);

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={hasActiveRange ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "h-8 gap-2 text-xs",
                            hasActiveRange && "bg-primary text-primary-foreground"
                        )}
                    >
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {rangeLabel || "Custom Range"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">
                                {selectingStart ? 'Select Start Date' : 'Select End Date'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {tempStartDate && (
                                    <span>Start: {format(tempStartDate, 'MMM d, yyyy')}</span>
                                )}
                                {tempStartDate && tempEndDate && <span className="mx-2">→</span>}
                                {tempEndDate && (
                                    <span>End: {format(tempEndDate, 'MMM d, yyyy')}</span>
                                )}
                            </div>
                        </div>

                        <Calendar
                            mode="single"
                            selected={selectingStart ? tempStartDate : tempEndDate}
                            onSelect={handleDateSelect}
                            initialFocus
                        />

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectingStart(true)}
                                    className={cn(
                                        "flex-1 text-xs",
                                        selectingStart && "bg-secondary"
                                    )}
                                >
                                    Pick Start
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectingStart(false)}
                                    className={cn(
                                        "flex-1 text-xs",
                                        !selectingStart && "bg-secondary"
                                    )}
                                >
                                    Pick End
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setTempStartDate(dateRange.startDate || undefined);
                                        setTempEndDate(dateRange.endDate || undefined);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleApply}
                                    className="flex-1 text-xs"
                                    disabled={!tempStartDate && !tempEndDate}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {hasActiveRange && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
};
