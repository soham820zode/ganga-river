import React from 'react';

interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: React.ReactNode;
  action?: React.ReactNode;
}

export function PanelHeader({ 
  title, 
  description, 
  status, 
  action, 
  className = '', 
  ...props 
}: PanelHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-surface/50 ${className}`} {...props}>
      <div className="flex flex-col space-y-0.5">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-text-primary">{title}</h3>
          {status && <div>{status}</div>}
        </div>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}