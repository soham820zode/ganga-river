"use client";
import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { DataSourceBadge } from '../ui/DataSourceBadge';

export function HeroStatus() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono font-bold">System</span>
          <StatusBadge status="ONLINE" />
        </div>
        <div className="w-px h-4 bg-slate-300" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono font-bold">Telemetry</span>
          <DataSourceBadge isSimulated={true} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] font-bold">
          5 MONITORING STATIONS &nbsp;&middot;&nbsp; 5 SENSOR PARAMETERS &nbsp;&middot;&nbsp; 48H FORECAST
        </span>
      </div>
    </div>
  );
}
