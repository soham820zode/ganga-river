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
    primary: 'bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(0,200,255,0.2)] active:scale-[0.98]',
    secondary: 'bg-white/[0.04] border border-white/10 text-text-primary hover:border-white/20 hover:bg-white/[0.06]',
    ghost: 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
    outline: 'bg-transparent border border-white/10 text-text-primary hover:border-accent/40 hover:text-accent hover:shadow-[0_0_20px_rgba(0,200,255,0.08)]',
    danger: 'bg-critical/10 border border-critical/30 text-critical hover:bg-critical/20 hover:border-critical/50',
    success: 'bg-success/10 border border-success/30 text-success hover:bg-success/20 hover:border-success/50',
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