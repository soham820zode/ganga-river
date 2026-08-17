"use client";
import React from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { PARAMETER_METADATA } from '../../config/parameters';
import { X, Info } from 'lucide-react';
import { formatValue } from '../../lib/utils/formatters';

export function ParameterDetailModal() {
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const { snapshot } = useSimulation();

  if (!selectedParameter) return null;

  const meta = PARAMETER_METADATA[selectedParameter];
  const stations = Object.values(snapshot.stations);

  // Calculate stats
  const values = stations.map(s => s.readings[selectedParameter]?.value).filter((v): v is number => v !== undefined);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-start p-6 border-b border-border/50 bg-surface-elevated">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{meta.displayName}</h2>
            <div className="flex gap-4 mt-2 text-sm text-text-secondary">
              <span className="font-mono bg-background px-2 py-1 rounded border border-border/50">{meta.key}</span>
              <span className="flex items-center gap-1"><Info className="w-4 h-4"/> Reference: {meta.reference}</span>
            </div>
          </div>
          <button onClick={() => setSelectedParameter(null)} className="p-2 text-text-muted hover:text-text-primary hover:bg-background rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-text-secondary mb-8">{meta.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-background rounded-xl border border-border/30">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Network Min</div>
              <div className="text-xl font-mono text-text-primary">{formatValue(min, meta.decimals)} <span className="text-sm text-text-muted">{meta.unit}</span></div>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border/30">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Network Avg</div>
              <div className="text-xl font-mono text-accent">{formatValue(avg, meta.decimals)} <span className="text-sm text-text-muted">{meta.unit}</span></div>
            </div>
            <div className="p-4 bg-background rounded-xl border border-border/30">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Network Max</div>
              <div className="text-xl font-mono text-text-primary">{formatValue(max, meta.decimals)} <span className="text-sm text-text-muted">{meta.unit}</span></div>
            </div>
          </div>

          <h3 className="text-sm font-bold tracking-widest text-text-primary mb-4 uppercase border-b border-border/30 pb-2">Station Comparison</h3>
          <div className="space-y-3">
            {stations.map(st => {
              const reading = st.readings[selectedParameter];
              if (!reading) return null;
              
              // Normalize for bar width. Just a simple visual relative to max clamp or max value.
              const barMax = Math.max(max * 1.2, 10); // arbitrary padding
              const widthPct = Math.min(100, Math.max(5, (reading.value / barMax) * 100));
              const colorClass = reading.status === 'CRITICAL' ? 'bg-red-500' : reading.status === 'WARNING' ? 'bg-amber-500' : 'bg-accent';

              return (
                <div key={st.id} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-text-secondary truncate text-right">{st.name}</div>
                  <div className="flex-1 h-6 bg-background rounded-full overflow-hidden border border-border/30 flex">
                    <div 
                      className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="w-24 font-mono text-sm text-text-primary">
                    {formatValue(reading.value, meta.decimals)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <h4 className="text-xs font-bold text-accent tracking-wider uppercase mb-2">Historical Analytics</h4>
            <p className="text-sm text-text-secondary italic">Historical trends and 48-hour forecasting charts will be unlocked in Step 08.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
