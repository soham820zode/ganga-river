import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { StatusType } from '../ui/StatusBadge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: StatusType;
  trend?: number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, unit, status, trend, icon }: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <ArrowUpRight className="h-3 w-3" />;
    if (trend < 0) return <ArrowDownRight className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return 'text-text-muted';
    // For water quality, usually up is worse (more pollution), but we'll use neutral red/green based on generic metrics
    // Since we don't know the exact metric here, we just apply generic styling
    if (trend > 0) return 'text-warning';
    if (trend < 0) return 'text-success';
    return 'text-text-muted';
  };

  return (
    <GlassCard padding="md" className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-medium text-text-secondary text-technical">{label}</h4>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold font-mono tracking-tight text-text-primary">{value}</span>
        {unit && <span className="text-sm text-text-muted ml-1">{unit}</span>}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          {status && (
            <>
              <div className={`h-1.5 w-1.5 rounded-full ${
                status === 'ONLINE' || status === 'LIVE' || status === 'READY' ? 'bg-success' :
                status === 'WARNING' ? 'bg-warning' :
                status === 'CRITICAL' ? 'bg-critical' : 'bg-text-muted'
              }`} />
              <span className="text-xs text-text-secondary capitalize">{status.toLowerCase()}</span>
            </>
          )}
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}