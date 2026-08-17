import React from 'react';
import { StatusBadge } from './StatusBadge';

interface DataSourceBadgeProps {
  isSimulated?: boolean;
  className?: string;
}

export function DataSourceBadge({ isSimulated = true, className = '' }: DataSourceBadgeProps) {
  return (
    <StatusBadge 
      status={isSimulated ? 'SIMULATED' : 'LIVE'} 
      className={className} 
    />
  );
}