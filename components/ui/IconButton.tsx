import React from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: React.ReactNode;
  label: string;
}

export function IconButton({ 
  variant = 'ghost', 
  size = 'md', 
  icon, 
  label, 
  className = '', 
  ...props 
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  const variantStyles = {
    primary: 'bg-surface-elevated border border-accent text-accent hover:bg-accent-soft hover:shadow-glow',
    secondary: 'bg-surface-elevated border border-border text-text-primary hover:border-text-muted hover:bg-surface',
    ghost: 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
    outline: 'bg-transparent border border-border text-text-primary hover:border-accent hover:text-accent',
    danger: 'bg-surface-elevated border border-critical text-critical hover:bg-critical/10',
    success: 'bg-surface-elevated border border-success text-success hover:bg-success/10',
  };

  return (
    <button 
      type="button"
      aria-label={label}
      title={label}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}