import React from 'react';

export type PanelProps = React.HTMLAttributes<HTMLDivElement>;

export function Panel({ className = '', children, ...props }: PanelProps) {
  return (
    <div 
      className={`bg-background border border-border rounded-lg overflow-hidden ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}