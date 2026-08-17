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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-start p-6 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{meta.displayName}</h2>
            <div className="flex gap-4 mt-2 text-sm text-slate-600">
              <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-bold">{meta.key}</span>
              <span className="flex items-center gap-1.5"><Info className="w-4 h-4 text-sky-600"/> Reference: {meta.reference}</span>
            </div>
          </div>
          <button onClick={() => setSelectedParameter(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-slate-600 mb-8 leading-relaxed">{meta.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Network Min</div>
              <div className="text-xl font-mono font-bold text-slate-800">{formatValue(min, meta.decimals)} <span className="text-sm text-slate-400">{meta.unit}</span></div>
            </div>
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
              <div className="text-[11px] text-sky-600 uppercase tracking-wider mb-1 font-bold">Network Avg</div>
              <div className="text-xl font-mono font-bold text-sky-700">{formatValue(avg, meta.decimals)} <span className="text-sm text-sky-600">{meta.unit}</span></div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Network Max</div>
              <div className="text-xl font-mono font-bold text-slate-800">{formatValue(max, meta.decimals)} <span className="text-sm text-slate-400">{meta.unit}</span></div>
            </div>
          </div>

          <h3 className="text-xs font-bold tracking-widest text-slate-900 mb-4 uppercase border-b border-slate-200 pb-2">Station Comparison</h3>
          <div className="space-y-3">
            {stations.map(st => {
              const reading = st.readings[selectedParameter];
              if (!reading) return null;
              
              const barMax = Math.max(max * 1.2, 10);
              const widthPct = Math.min(100, Math.max(5, (reading.value / barMax) * 100));
              const colorClass = reading.status === 'CRITICAL' ? 'bg-rose-500' : reading.status === 'WARNING' ? 'bg-amber-500' : 'bg-sky-500';

              return (
                <div key={st.id} className="flex items-center gap-4">
                  <div className="w-32 text-xs font-semibold text-slate-700 truncate text-right">{st.name}</div>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex">
                    <div 
                      className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="w-24 font-mono text-xs font-bold text-slate-800">
                    {formatValue(reading.value, meta.decimals)} {meta.unit}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-sky-50/70 border border-sky-200 rounded-2xl">
            <h4 className="text-xs font-bold text-sky-800 tracking-wider uppercase mb-1">Predictive Intelligence</h4>
            <p className="text-xs text-slate-600">Access 48-hour neural forecasts and historical regression charts in the Forecast & Analytics modules.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
