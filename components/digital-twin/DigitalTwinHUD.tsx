"use client";
import React from 'react';
import { DataSourceBadge } from '../ui/DataSourceBadge';

export function DigitalTwinHUD() {
  return (
    <div className="absolute top-6 left-6 z-10 pointer-events-none hidden md:flex flex-col gap-2">
      <h2 className="text-sm font-bold tracking-[0.2em] text-text-primary uppercase mb-2">
        SPATIAL INTELLIGENCE
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-text-muted uppercase tracking-widest text-technical">NETWORK</span>
        <span className="text-xs text-text-primary font-mono">5 DEMO STATIONS</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-text-muted uppercase tracking-widest text-technical">DATA</span>
        <DataSourceBadge isSimulated={true} />
      </div>
    </div>
  );
}
