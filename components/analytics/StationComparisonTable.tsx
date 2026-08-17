"use client";
import React, { useMemo } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { getHistoryForRange, calculateHistoricalStats } from '../../lib/utils/analytics';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';

export function StationComparisonTable() {
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const analyticsTimeRange = useJalPulseStore(state => state.analyticsTimeRange);
  const { history, snapshot } = useSimulation();

  const meta = selectedParameter ? PARAMETER_METADATA[selectedParameter] : null;

  const tableData = useMemo(() => {
    if (!selectedParameter) return [];
    
    return Object.keys(history).map(stId => {
      const rawData = getHistoryForRange(history, stId, selectedParameter, analyticsTimeRange);
      const stats = calculateHistoricalStats(rawData);
      const current = snapshot.stations[stId]?.readings[selectedParameter];
      
      return {
        id: stId,
        name: snapshot.stations[stId]?.name || stId,
        min: stats.min,
        max: stats.max,
        avg: stats.avg,
        current: current?.value || 0,
        status: current?.status || 'NORMAL'
      };
    });
  }, [history, snapshot, selectedParameter, analyticsTimeRange]);

  if (!meta || !tableData.length) return null;

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <h3 className="text-xs font-bold tracking-[0.2em] text-sky-600 mb-4 uppercase">Station Comparison ({analyticsTimeRange})</h3>
      
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Station</th>
              <th className="p-4 text-right">Minimum</th>
              <th className="p-4 text-right">Average</th>
              <th className="p-4 text-right">Maximum</th>
              <th className="p-4 text-right border-l border-slate-200">Current</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {tableData.map(row => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-xs text-slate-400 font-mono font-medium">{row.id}</div>
                </td>
                <td className="p-4 text-right font-mono text-slate-600 font-medium">{formatValue(row.min, meta.decimals)}</td>
                <td className="p-4 text-right font-mono font-bold text-sky-700">{formatValue(row.avg, meta.decimals)}</td>
                <td className="p-4 text-right font-mono text-slate-600 font-medium">{formatValue(row.max, meta.decimals)}</td>
                <td className={`p-4 text-right font-mono font-bold border-l border-slate-200 ${row.status === 'CRITICAL' ? 'text-rose-600' : row.status === 'WARNING' ? 'text-amber-600' : 'text-slate-900'}`}>
                  {formatValue(row.current, meta.decimals)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-400 italic">Continuous telemetry streams monitored across 5 primary corridor stations.</p>
    </div>
  );
}
