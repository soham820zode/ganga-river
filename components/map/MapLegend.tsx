"use client";
import React from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export function MapLegend() {
  const mapLayerType = useJalPulseStore(state => state.mapLayerType);

  return (
    <div className="absolute bottom-6 left-6 z-[400] pointer-events-none hidden sm:block">
      <div className="px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            ALERT SEVERITY MATRIX
          </span>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono">
            {mapLayerType === 'SATELLITE' ? '🛰️ SATELLITE OVERLAY' : mapLayerType === 'DARK' ? '🌌 TACTICAL DARK' : '🗺️ VECTOR LIGHT'}
          </span>
        </div>
        
        <div className="flex gap-4 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className="relative flex items-center justify-center w-3.5 h-3.5">
              <span className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-rose-700 font-bold uppercase leading-none">RED ALERT</span>
              <span className="text-[8px] text-slate-400 font-mono">DO &lt; 4.0 / BOD &gt; 6</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-700 font-bold uppercase leading-none">MODERATE</span>
              <span className="text-[8px] text-slate-400 font-mono">Threshold stress</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-700 font-bold uppercase leading-none">LOW / SAFE</span>
              <span className="text-[8px] text-slate-400 font-mono">Within standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
