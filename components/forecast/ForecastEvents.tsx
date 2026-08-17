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
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <h3 className="text-sm font-bold tracking-[0.2em] text-red-500 mb-4 uppercase flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Projected Events
        </h3>
        <div className="space-y-2">
          {forecast.thresholdCrossings.map((cross, i) => (
             <div key={i} className="flex justify-between items-center bg-surface-elevated/50 p-3 rounded-lg text-sm border border-red-500/20">
               <div>
                 <span className="font-mono text-text-secondary mr-4">
                   {new Date(cross.timestamp).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                 </span>
                 <span className="text-text-primary">
                   Projected crossing of {meta.displayName} reference ({meta.reference})
                 </span>
               </div>
               <div className="font-mono font-bold text-red-500">
                 {formatValue(cross.value, meta.decimals)} {meta.unit}
               </div>
             </div>
          ))}
        </div>
        <p className="text-xs text-red-400/70 mt-4 italic">
          * This is a forecasted event, not a confirmed incident. No alerts will be triggered until confirmed by real-time telemetry.
        </p>
      </div>
    </div>
  );
}
