"use client";
import React, { useEffect } from 'react';
import { useJalPulseStore, TimeRangeType } from '../../store/useJalPulseStore';
import { ParameterType } from '../../types/water-quality';
import { PARAMETER_METADATA } from '../../config/parameters';
import { useSimulation } from '../../hooks/useSimulation';

export function AnalyticsFilters() {
  const analyticsTimeRange = useJalPulseStore(state => state.analyticsTimeRange);
  const setAnalyticsTimeRange = useJalPulseStore(state => state.setAnalyticsTimeRange);
  const analyticsMode = useJalPulseStore(state => state.analyticsMode);
  const setAnalyticsMode = useJalPulseStore(state => state.setAnalyticsMode);
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const { snapshot } = useSimulation();

  useEffect(() => {
    if (!selectedParameter) setSelectedParameter('BOD');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parameters: ParameterType[] = ['pH', 'DO', 'BOD', 'Temperature', 'Turbidity'];
  const timeRanges: TimeRangeType[] = ['1H', '6H', '24H', '48H', '72H'];

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 p-4 sticky top-16 z-20 shadow-xs">
      <div className="flex flex-wrap gap-4 items-center">
        
        {/* Mode & Station */}
        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200 shadow-xs">
          <select 
            className="bg-transparent text-xs text-slate-900 px-3 py-1.5 outline-none font-bold cursor-pointer"
            value={analyticsMode === 'NETWORK' ? 'ALL' : (selectedStationId || '')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'ALL') {
                setAnalyticsMode('NETWORK');
                setSelectedStation(null);
              } else {
                setAnalyticsMode('STATION');
                setSelectedStation(val);
              }
            }}
          >
            <option value="ALL">Network Average</option>
            {Object.values(snapshot.stations).map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>

        {/* Parameter */}
        <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200 overflow-x-auto hide-scrollbar gap-1">
          {parameters.map(p => (
            <button
              key={p}
              onClick={() => setSelectedParameter(p)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedParameter === p 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              {PARAMETER_METADATA[p].displayName}
            </button>
          ))}
        </div>

        {/* Time Range */}
        <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200 ml-auto gap-1">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => setAnalyticsTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all ${
                analyticsTimeRange === r 
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 border border-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
