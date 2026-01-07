import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { CalendarIcon, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onAddTransaction: (type: 'income' | 'expense', amount: number, date: Date, description?: string) => void;
}

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <TransactionDialog
        type="income"
        open={incomeOpen}
        onOpenChange={setIncomeOpen}
        onAdd={onAddTransaction}
      />
      <TransactionDialog
        type="expense"
        open={expenseOpen}
        onOpenChange={setExpenseOpen}
        onAdd={onAddTransaction}
      />
    </div>
  );
};

interface TransactionDialogProps {
  type: 'income' | 'expense';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (type: 'income' | 'expense', amount: number, date: Date, description?: string) => void;
}

const TransactionDialog = ({ type, open, onOpenChange, onAdd }: TransactionDialogProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isIncome = type === 'income';
  const Icon = isIncome ? TrendingUp : TrendingDown;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAdd(type, numAmount, date, description || undefined);
    setAmount('');
    setDate(new Date());
    setDescription('');
    onOpenChange(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "gap-2 rounded-xl font-medium transition-all",
            isIncome 
              ? "gradient-success hover:opacity-90 text-success-foreground" 
              : "gradient-destructive hover:opacity-90 text-destructive-foreground"
          )}
        >
          <Plus className="w-4 h-4" />
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isIncome ? "gradient-success" : "gradient-destructive"
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            Add {isIncome ? 'Income' : 'Expense'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8 text-lg font-semibold h-12"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) setDate(d);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              placeholder={isIncome ? "e.g., Monthly salary, Freelance payment" : "e.g., Rent, Groceries, Utilities"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl transition-all",
              isIncome 
                ? "gradient-success hover:opacity-90 text-success-foreground" 
                : "gradient-destructive hover:opacity-90 text-destructive-foreground"
            )}
          >
            Add {isIncome ? 'Income' : 'Expense'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
