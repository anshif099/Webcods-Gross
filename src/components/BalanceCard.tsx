import { TrendingUp, TrendingDown, AlertTriangle, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export const BalanceCard = ({ balance, totalIncome, totalExpenses }: BalanceCardProps) => {
  const isNegative = balance < 0;
  const isPositive = balance > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Main Balance Card */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 shadow-card transition-all duration-300",
        isNegative ? "bg-destructive/5 border-2 border-destructive/20" : "bg-card border border-border"
      )}>
        {isNegative && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium animate-pulse-subtle">
            <AlertTriangle className="w-3 h-3" />
            Loss Zone
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Total Balance</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-4xl font-bold tracking-tight",
            isNegative ? "text-destructive" : isPositive ? "text-success" : "text-foreground"
          )}>
            {isNegative && '-'}{formatCurrency(balance)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {isNegative ? (
            <TrendingDown className="w-4 h-4 text-destructive" />
          ) : (
            <TrendingUp className="w-4 h-4 text-success" />
          )}
          <span className={cn(
            "text-sm font-medium",
            isNegative ? "text-destructive" : "text-success"
          )}>
            {isNegative ? 'Negative Balance' : 'Healthy Balance'}
          </span>
        </div>
      </div>

      {/* Income Card */}
      <div className="rounded-2xl p-6 bg-success/5 border border-success/20 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-success-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Total Income</span>
        </div>
        <span className="text-2xl font-bold text-success">
          +{formatCurrency(totalIncome)}
        </span>
      </div>

      {/* Expenses Card */}
      <div className="rounded-2xl p-6 bg-destructive/5 border border-destructive/20 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg gradient-destructive flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-destructive-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
        </div>
        <span className="text-2xl font-bold text-destructive">
          -{formatCurrency(totalExpenses)}
        </span>
      </div>
    </div>
  );
};
