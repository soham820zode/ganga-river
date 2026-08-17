"use client";
import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { DataSourceBadge } from '../ui/DataSourceBadge';

export function HeroStatus() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-text-muted uppercase tracking-[0.3em] font-mono">System</span>
          <StatusBadge status="ONLINE" />
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-text-muted uppercase tracking-[0.3em] font-mono">Source</span>
          <DataSourceBadge isSimulated={true} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-text-muted font-mono tracking-[0.2em]">
          5 STATIONS &nbsp;&middot;&nbsp; 5 PARAMETERS &nbsp;&middot;&nbsp; 48H FORECAST
        </span>
      </div>
    </div>
  );
}
