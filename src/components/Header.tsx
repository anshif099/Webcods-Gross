import { IndianRupee } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Webcods Gross
            </h1>
            <p className="text-xs text-muted-foreground">
              Personal Finance Tracker
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
