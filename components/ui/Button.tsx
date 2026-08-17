import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  children, 
  disabled, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'text-[10px] px-4 py-2',
    md: 'text-[11px] px-5 py-2.5',
    lg: 'text-xs px-7 py-3.5',
  };
  
  const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md border border-slate-900 active:scale-[0.98]',
    secondary: 'bg-slate-100/90 border border-slate-200 text-slate-800 hover:bg-slate-200/80 hover:border-slate-300 shadow-sm',
    ghost: 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50/60 shadow-sm',
    danger: 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/80 shadow-sm',
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/80 shadow-sm',
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}