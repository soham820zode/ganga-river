import React from 'react';

export type BadgeVariant = 'default' | 'outline' | 'accent' | 'success' | 'warning' | 'critical' | 'technical';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase';
  
  const variantStyles = {
    default: 'bg-white/[0.04] text-text-secondary border border-white/[0.08]',
    outline: 'bg-transparent text-text-primary border border-white/10',
    accent: 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_10px_rgba(0,200,255,0.08)]',
    success: 'bg-success/10 text-success border border-success/20 shadow-[0_0_10px_rgba(0,230,138,0.08)]',
    warning: 'bg-warning/10 text-warning border border-warning/20 shadow-[0_0_10px_rgba(255,179,71,0.08)]',
    critical: 'bg-critical/10 text-critical border border-critical/20 shadow-[0_0_10px_rgba(255,71,87,0.08)]',
    technical: 'bg-transparent text-text-muted text-technical tracking-[0.15em]',
  };

  return (
    <span 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}