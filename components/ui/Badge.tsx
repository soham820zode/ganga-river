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
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-white text-slate-800 border border-slate-300 shadow-sm',
    accent: 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm',
    critical: 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm',
    technical: 'bg-slate-50 text-slate-500 border border-slate-200 text-technical tracking-[0.15em]',
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