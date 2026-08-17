"use client";
import React from 'react';

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-6 z-[400] pointer-events-none hidden sm:block">
      <div className="px-3 py-2 rounded-lg bg-surface-elevated/90 backdrop-blur-md border border-border/50 shadow-xl flex flex-col gap-2 pointer-events-auto">
        <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">
          STATION STATUS
        </span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-[10px] text-text-muted">NORMAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[10px] text-text-muted">WARNING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[10px] text-text-muted">CRITICAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
