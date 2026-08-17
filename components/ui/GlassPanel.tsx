import React from 'react';
import { GlassCardProps, GlassCard } from './GlassCard';

export function GlassPanel({ className = '', padding = 'none', ...props }: GlassCardProps) {
  return (
    <GlassCard 
      className={`overflow-hidden ${className}`} 
      padding={padding}
      {...props}
    />
  );
}