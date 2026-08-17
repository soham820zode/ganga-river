import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  glow?: 'none' | 'cyan' | 'green' | 'amber' | 'red';
}

export function GlassCard({ 
  className = '', 
  interactive = false, 
  padding = 'md',
  elevated = false,
  glow = 'none',
  children, 
  ...props 
}: GlassCardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const glowStyles = {
    none: '',
    cyan: 'border-glow-cyan',
    green: 'border-glow-green',
    amber: 'border-glow-amber',
    red: 'border-glow-red',
  };
  
  const interactiveStyles = interactive 
    ? 'cursor-pointer hover:border-accent/25 hover:shadow-[0_0_30px_rgba(0,200,255,0.08)] active:scale-[0.99]' 
    : '';
    
  const baseClass = elevated ? 'glass-panel-elevated' : 'aetheris-glass';
  
  return (
    <div 
      className={`${baseClass} rounded-2xl ${paddingStyles[padding]} ${interactiveStyles} ${glowStyles[glow]} transition-all duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}