import { Header } from '@/components/Header';
import { BalanceCard } from '@/components/BalanceCard';
import { FinanceChart } from '@/components/FinanceChart';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    chartData,
    viewMode,
    setViewMode,
    dateRange,
    setDateRange,
    loading,
    error,
  } = useTransactions();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Balance Overview */}
            <BalanceCard
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              <TransactionForm onAddTransaction={addTransaction} />
            </div>

            {/* Chart */}
            <FinanceChart
              data={chartData}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            {/* Transactions List */}
            <TransactionList
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
