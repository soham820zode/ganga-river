import React from 'react';
import { Activity } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title = 'NO MONITORING DATA', 
  description = 'Waiting for data stream...', 
  icon = <Activity className="h-8 w-8 text-text-muted" /> 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-surface/30">
      <div className="mb-4 rounded-full bg-surface-elevated p-3">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-text-primary text-technical mb-1">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}