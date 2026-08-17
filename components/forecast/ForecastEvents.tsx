"use client";
import React from 'react';
import { useForecast } from '../../hooks/useForecast';
import { formatValue } from '../../lib/utils/formatters';
import { PARAMETER_METADATA } from '../../config/parameters';
import { AlertTriangle } from 'lucide-react';

export function ForecastEvents() {
  const { forecast, selectedParameter } = useForecast();

  if (!forecast || !selectedParameter || forecast.status !== 'PROJECTED EXCEEDANCE') return null;

  const meta = PARAMETER_METADATA[selectedParameter];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold tracking-[0.2em] text-rose-700 mb-4 uppercase flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" /> Projected Events
        </h3>
        <div className="space-y-2">
          {forecast.thresholdCrossings.map((cross, i) => (
             <div key={i} className="flex justify-between items-center bg-white p-3.5 rounded-xl text-sm border border-rose-200 shadow-xs">
               <div>
                 <span className="font-mono text-slate-500 font-bold mr-4">
                   {new Date(cross.timestamp).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                 </span>
                 <span className="text-slate-800 font-semibold">
                   Projected crossing of {meta.displayName} reference ({meta.reference})
                 </span>
               </div>
               <div className="font-mono font-bold text-rose-600">
                 {formatValue(cross.value, meta.decimals)} {meta.unit}
               </div>
             </div>
          ))}
        </div>
        <p className="text-xs text-rose-600/80 mt-4 italic">
          * This is a forecasted event, not a confirmed incident. No alerts will be triggered until confirmed by real-time telemetry.
        </p>
      </div>
    </div>
  );
}
