"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  return (
    <div className="hero-element absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0">
      <span className="text-[9px] tracking-[0.4em] uppercase text-text-muted font-mono">
        Scroll to navigate Ganga current
      </span>
      <div className="flex flex-col items-center animate-float">
        <ChevronDown className="w-4 h-4 text-accent/60" />
        <ChevronDown className="w-4 h-4 text-accent/40 -mt-2" />
      </div>
    </div>
  );
}
