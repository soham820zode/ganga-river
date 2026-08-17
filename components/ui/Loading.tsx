import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-surface-elevated ${className}`} />
  );
}

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  
  return (
    <div className={`animate-spin rounded-full border-current border-t-transparent text-accent ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingPanel({ text = 'Loading data stream...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[200px] glass-panel rounded-lg">
      <Spinner size="md" className="mb-4" />
      <p className="text-sm text-text-secondary text-technical">{text}</p>
    </div>
  );
}