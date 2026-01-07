import { Transaction } from '@/types/finance';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 shadow-card text-center">
        <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-4 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No transactions yet</h3>
        <p className="text-sm text-muted-foreground">
          Start by adding your first income or expense
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <p className="text-sm text-muted-foreground">{transactions.length} total entries</p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-2">
          {sortedTransactions.map((transaction, index) => {
            const isIncome = transaction.type === 'income';
            const Icon = isIncome ? TrendingUp : TrendingDown;

            return (
              <div
                key={transaction.id}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 animate-slide-up",
                  isIncome 
                    ? "bg-success/5 border-success/20 hover:border-success/40" 
                    : "bg-destructive/5 border-destructive/20 hover:border-destructive/40"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isIncome ? "gradient-success" : "gradient-destructive"
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.description || (isIncome ? 'Income' : 'Expense')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-lg font-bold",
                    isIncome ? "text-success" : "text-destructive"
                  )}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
