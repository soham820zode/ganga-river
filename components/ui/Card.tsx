import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className = '', padding = 'md', children, ...props }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  return (
    <div 
      className={`bg-surface border border-border rounded-lg ${paddingStyles[padding]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}