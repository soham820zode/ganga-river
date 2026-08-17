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
    <div className="w-full bg-surface-elevated border-b border-border/50 p-4 sticky top-16 z-30">
      <div className="flex flex-wrap gap-4 items-center">
        
        {/* Mode & Station */}
        <div className="flex items-center bg-background rounded-lg p-1 border border-border/50">
          <select 
            className="bg-transparent text-sm text-text-primary px-3 py-1 outline-none font-semibold cursor-pointer"
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
        <div className="flex bg-background rounded-lg p-1 border border-border/50 overflow-x-auto hide-scrollbar">
          {parameters.map(p => (
            <button
              key={p}
              onClick={() => setSelectedParameter(p)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                selectedParameter === p 
                  ? 'bg-accent/20 text-accent border border-accent/30' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated border border-transparent'
              }`}
            >
              {PARAMETER_METADATA[p].displayName}
            </button>
          ))}
        </div>

        {/* Time Range */}
        <div className="flex bg-background rounded-lg p-1 border border-border/50 ml-auto">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => setAnalyticsTimeRange(r)}
              className={`px-3 py-1 text-xs font-bold font-mono rounded-md transition-colors ${
                analyticsTimeRange === r 
                  ? 'bg-surface-elevated text-text-primary border border-border/50 shadow-sm' 
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
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
