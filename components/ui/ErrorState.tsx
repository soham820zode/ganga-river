import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'DATA STREAM UNAVAILABLE', 
  description = 'Monitoring data could not be loaded.', 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-critical/20 rounded-lg bg-critical/5">
      <div className="mb-4 rounded-full bg-critical/10 p-3">
        <AlertTriangle className="h-8 w-8 text-critical" />
      </div>
      <h3 className="text-sm font-medium text-critical text-technical mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}