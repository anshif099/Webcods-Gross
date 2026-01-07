import { Transaction, DateRange } from '@/types/finance';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * Check if a transaction falls within the specified date range
 */
export const isTransactionInDateRange = (
    transaction: Transaction,
    dateRange: DateRange
): boolean => {
    if (!dateRange.startDate && !dateRange.endDate) {
        return true; // No filter applied
    }

    const transactionDate = new Date(transaction.date);

    if (dateRange.startDate && dateRange.endDate) {
        return isWithinInterval(transactionDate, {
            start: startOfDay(dateRange.startDate),
            end: endOfDay(dateRange.endDate),
        });
    }

    if (dateRange.startDate) {
        return transactionDate >= startOfDay(dateRange.startDate);
    }

    if (dateRange.endDate) {
        return transactionDate <= endOfDay(dateRange.endDate);
    }

    return true;
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByDateRange = (
    transactions: Transaction[],
    dateRange: DateRange
): Transaction[] => {
    return transactions.filter(t => isTransactionInDateRange(t, dateRange));
};

/**
 * Generate a readable label for the date range
 */
export const getDateRangeLabel = (startDate: Date | null, endDate: Date | null): string => {
    if (!startDate && !endDate) {
        return '';
    }

    if (startDate && endDate) {
        const isSameMonth = format(startDate, 'MMM yyyy') === format(endDate, 'MMM yyyy');
        if (isSameMonth) {
            return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
        }
        return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
    }

    if (startDate) {
        return `From ${format(startDate, 'MMM d, yyyy')}`;
    }

    if (endDate) {
        return `Until ${format(endDate, 'MMM d, yyyy')}`;
    }

    return '';
};
