import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartDataPoint, ViewMode, DateRange } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/DateRangePicker';

interface FinanceChartProps {
  data: ChartDataPoint[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

type ChartType = 'area' | 'bar';

export const FinanceChart = ({ data, viewMode, onViewModeChange, dateRange, onDateRangeChange }: FinanceChartProps) => {
  const [chartType, setChartType] = useState<ChartType>('area');

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg animate-fade-in">
          <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className={cn(
                "font-medium",
                entry.name === 'income' && "text-success",
                entry.name === 'expense' && "text-destructive",
                entry.name === 'balance' && (entry.value >= 0 ? "text-primary" : "text-destructive")
              )}>
                {entry.name === 'balance' && entry.value < 0 && '-'}
                ₹{Math.abs(entry.value).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Financial Overview</h2>
            <p className="text-sm text-muted-foreground">Track your income and expenses</p>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType('area')}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                chartType === 'area' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <LineChart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType('bar')}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                chartType === 'bar' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Mode and Date Range Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-secondary rounded-lg p-1 flex-wrap">
            {(['daily', 'weekly', 'monthly', 'yearly', 'overall'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  "h-8 px-3 rounded-md capitalize transition-all text-xs",
                  viewMode === mode ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
              >
                {mode}
              </Button>
            ))}
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </div>

      <div className="h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 92%)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
                tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(217, 100%, 50%)"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 92%)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
                tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
        {chartType === 'area' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Balance</span>
          </div>
        )}
      </div>
    </div>
  );
};
