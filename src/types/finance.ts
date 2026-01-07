export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;
}

export interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'overall';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}
