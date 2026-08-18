"use client";
import React, { useState } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { PARAMETER_METADATA } from '../../config/parameters';
import { X, Info, Waves, BarChart3, Wind, Sparkles } from 'lucide-react';
import { formatValue } from '../../lib/utils/formatters';
import { OxygenFlowVisualizer } from '../water-quality/OxygenFlowVisualizer';

export function ParameterDetailModal() {
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const { snapshot } = useSimulation();

  const [activeTab, setActiveTab] = useState<'analytics' | 'oxygenFlow'>('analytics');

  if (!selectedParameter) return null;

  const meta = PARAMETER_METADATA[selectedParameter];
  const stations = Object.values(snapshot.stations);

  // Calculate stats
  const values = stations.map(s => s.readings[selectedParameter]?.value).filter((v): v is number => v !== undefined);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const isOxygenRelated = selectedParameter === 'DO' || selectedParameter === 'BOD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-md"
              style={{ backgroundColor: meta.accentHex }}
            >
              {meta.key.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{meta.displayName}</h2>
                {isOxygenRelated && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-sky-600" /> OXYGEN FLOW DYNAMICS
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-1.5 text-xs text-slate-600">
                <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-bold">{meta.key}</span>
                <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-sky-600"/> Reference: {meta.reference}</span>
                <span className="text-slate-400 font-mono">Unit: {meta.unit}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedParameter(null)} 
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Sensor Telemetry & Network Stats
          </button>

          <button
            onClick={() => setActiveTab('oxygenFlow')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'oxygenFlow'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Waves className="w-4 h-4 text-sky-500 animate-pulse" />
            Oxygen Flow & River Wave Dynamics
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
          
          {activeTab === 'oxygenFlow' ? (
            <div className="space-y-4">
              <OxygenFlowVisualizer />
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-6 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 text-sm">
                {meta.description}
              </p>

              {/* Network Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold font-mono">Network Min</div>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {formatValue(min, meta.decimals)} <span className="text-xs text-slate-400">{meta.unit}</span>
                  </div>
                </div>

                <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200 shadow-sm">
                  <div className="text-[10px] text-sky-600 uppercase tracking-wider mb-1 font-bold font-mono">Corridor Mean</div>
                  <div className="text-2xl font-mono font-bold text-sky-700">
                    {formatValue(avg, meta.decimals)} <span className="text-xs text-sky-600">{meta.unit}</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold font-mono">Network Max</div>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {formatValue(max, meta.decimals)} <span className="text-xs text-slate-400">{meta.unit}</span>
                  </div>
                </div>
              </div>

              {/* Station Comparison Progress Bars with Animations */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
                <h3 className="text-xs font-bold tracking-widest text-slate-900 mb-4 uppercase border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>Station Corridor Comparison</span>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">REAL-TIME VALUES</span>
                </h3>

                <div className="space-y-3.5">
                  {stations.map(st => {
                    const reading = st.readings[selectedParameter];
                    if (!reading) return null;
                    
                    const barMax = Math.max(max * 1.25, 10);
                    const widthPct = Math.min(100, Math.max(8, (reading.value / barMax) * 100));
                    const isRed = reading.status === 'CRITICAL';
                    const isWarn = reading.status === 'WARNING';
                    
                    const colorClass = isRed 
                      ? 'bg-gradient-to-r from-rose-400 to-rose-600' 
                      : isWarn 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                      : 'bg-gradient-to-r from-sky-400 to-sky-600';

                    return (
                      <div key={st.id} className="flex items-center gap-4">
                        <div className="w-32 text-xs font-semibold text-slate-700 truncate text-right">
                          {st.name}
                        </div>
                        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex relative">
                          <div 
                            className={`h-full ${colorClass} transition-all duration-700 ease-out`}
                            style={{ width: `${widthPct}%` }}
                          >
                            <div className="absolute inset-0 animate-shimmer" />
                          </div>
                        </div>
                        <div className="w-28 flex items-center justify-between font-mono text-xs font-bold text-slate-800">
                          <span>{formatValue(reading.value, meta.decimals)} {meta.unit}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isRed ? 'bg-rose-100 text-rose-700' : isWarn ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isRed ? 'RED ALERT' : isWarn ? 'WARN' : 'SAFE'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Jump to Oxygen Stream Visualizer */}
              {isOxygenRelated && (
                <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-500 text-white shadow-sm">
                      <Wind className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">Interactive River Oxygen Stream Dynamics</h4>
                      <p className="text-xs text-slate-600">Simulate bubble particles, re-aeration cascades, and metabolic BOD demand.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('oxygenFlow')}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
                  >
                    Open Oxygen Flow
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
