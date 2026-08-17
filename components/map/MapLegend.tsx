"use client";
import React from 'react';

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-6 z-[400] pointer-events-none hidden sm:block">
      <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex flex-col gap-2 pointer-events-auto">
        <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase font-mono">
          STATION NETWORK STATUS
        </span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></div>
            <span className="text-[10px] text-slate-700 font-bold">NORMAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs"></div>
            <span className="text-[10px] text-slate-700 font-bold">WARNING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs"></div>
            <span className="text-[10px] text-slate-700 font-bold">CRITICAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
