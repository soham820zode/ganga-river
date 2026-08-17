"use client";
import React, { useMemo } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { getHistoryForRange, calculateHistoricalStats } from '../../lib/utils/analytics';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';

export function AnalyticsSummary() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const analyticsTimeRange = useJalPulseStore(state => state.analyticsTimeRange);
  const analyticsMode = useJalPulseStore(state => state.analyticsMode);
  const { history } = useSimulation();

  const meta = selectedParameter ? PARAMETER_METADATA[selectedParameter] : null;

  const stats = useMemo(() => {
    if (!selectedParameter) return null;
    const targetStation = analyticsMode === 'STATION' ? selectedStationId : null;
    const rawData = getHistoryForRange(history, targetStation, selectedParameter, analyticsTimeRange);
    return calculateHistoricalStats(rawData, PARAMETER_METADATA[selectedParameter].reference);
  }, [history, selectedParameter, selectedStationId, analyticsTimeRange, analyticsMode]);

  if (!meta || !stats) return null;

  const TrendIcon = stats.change > 1 ? ArrowUpRight : stats.change < -1 ? ArrowDownRight : Minus;
  const trendColor = stats.change > 5 ? 'text-amber-500' : stats.change < -5 ? 'text-accent' : 'text-text-secondary';

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 md:px-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">{analyticsTimeRange} Average</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-slate-900 font-bold">{formatValue(stats.avg, meta.decimals)}</span>
          <span className="text-xs text-slate-500">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Net Change</div>
        <div className={`flex items-center gap-2 text-lg font-mono font-bold ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
          {stats.change > 0 ? '+' : ''}{formatValue(stats.change, 1)}%
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Maximum</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-slate-900 font-bold">{formatValue(stats.max, meta.decimals)}</span>
          <span className="text-xs text-slate-500">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Reference</div>
        <div className="text-base font-mono text-slate-800 font-bold mt-1">
          {meta.reference}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm col-span-2 md:col-span-4 lg:col-span-1">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Threshold Crossings
        </div>
        <div className={`text-2xl font-mono font-bold ${stats.crossings > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
          {stats.crossings} <span className="text-xs text-slate-500 font-sans font-normal uppercase ml-1">Events</span>
        </div>
      </div>
    </div>
  );
}
