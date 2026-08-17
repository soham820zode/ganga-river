import React from 'react';
import { Badge } from './Badge';

export type StatusType = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'READY' | 'WARNING' | 'CRITICAL' | 'SIMULATED' | 'DEMO' | 'LIVE';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ONLINE':
      case 'LIVE':
      case 'READY':
        return { variant: 'success' as const, dotClass: 'bg-success shadow-[0_0_6px_rgba(0,230,138,0.6)]', pulse: true };
      case 'WARNING':
        return { variant: 'warning' as const, dotClass: 'bg-warning shadow-[0_0_6px_rgba(255,179,71,0.6)]', pulse: true };
      case 'CRITICAL':
      case 'OFFLINE':
        return { variant: 'critical' as const, dotClass: 'bg-critical shadow-[0_0_6px_rgba(255,71,87,0.6)]', pulse: status === 'CRITICAL' };
      case 'CONNECTING':
      case 'SIMULATED':
      case 'DEMO':
        return { variant: 'accent' as const, dotClass: 'bg-accent shadow-[0_0_6px_rgba(0,200,255,0.6)]', pulse: false };
      default:
        return { variant: 'default' as const, dotClass: 'bg-text-muted', pulse: false };
    }
  };

  const { variant, dotClass, pulse } = getStatusConfig();

  return (
    <Badge variant={variant} className={`gap-2 pl-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={`absolute inset-0 rounded-full ${dotClass} opacity-50 animate-ping`} aria-hidden="true" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
      </span>
      {status}
    </Badge>
  );
}