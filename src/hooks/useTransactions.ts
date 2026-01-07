import { useState, useMemo, useCallback, useEffect } from 'react';
import { Transaction, ChartDataPoint, ViewMode } from '@/types/finance';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { initAuth } from '@/lib/firebase';
import {
  saveTransaction as saveTransactionToFirebase,
  deleteTransaction as deleteTransactionFromFirebase,
  subscribeToTransactions,
  migrateLocalStorageData
} from '@/services/transactionService';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize Firebase authentication and set up real-time listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        // Sign in anonymously
        const uid = await initAuth();
        setUserId(uid);

        // Migrate localStorage data if exists
        await migrateLocalStorageData();

        // Subscribe to real-time updates
        unsubscribe = subscribeToTransactions(uid, (updatedTransactions) => {
          setTransactions(updatedTransactions);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error initializing Firebase:', err);
        setError('Failed to connect to database. Please refresh the page.');
        setLoading(false);
      }
    };

    initialize();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const addTransaction = useCallback(async (
    type: 'income' | 'expense',
    amount: number,
    date: Date,
    description?: string
  ) => {
    if (!userId) {
      setError('Not authenticated. Please refresh the page.');
      return;
    }

    const newTransaction: Transaction = {
      id: generateId(),
      type,
      amount,
      date,
      description,
    };

    try {
      await saveTransactionToFirebase(newTransaction);
      // Real-time listener will automatically update the state
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
    }
  }, [userId]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!userId) {
      setError('Not authenticated. Please refresh the page.');
      return;
    }

    try {
      await deleteTransactionFromFirebase(id);
      // Real-time listener will automatically update the state
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
    }
  }, [userId]);

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const chartData = useMemo((): ChartDataPoint[] => {
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(t => {
      let key: string;
      const date = new Date(t.date);

      switch (viewMode) {
        case 'weekly':
          key = format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d');
          break;
        case 'monthly':
          key = format(startOfMonth(date), 'MMM yyyy');
          break;
        default:
          key = format(date, 'MMM d');
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        grouped[key].income += t.amount;
      } else {
        grouped[key].expense += t.amount;
      }
    });

    let runningBalance = 0;
    return Object.entries(grouped).map(([date, data]) => {
      runningBalance += data.income - data.expense;
      return {
        date,
        income: data.income,
        expense: data.expense,
        balance: runningBalance,
      };
    });
  }, [transactions, viewMode]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    chartData,
    viewMode,
    setViewMode,
    loading,
    error,
  };
};

