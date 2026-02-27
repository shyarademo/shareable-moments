import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, icon, prefix = '' }) => {
  const isPositive = change >= 0;
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-card-foreground font-body">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}% vs yesterday</span>
      </div>
    </div>
  );
};

export default StatsCard;
