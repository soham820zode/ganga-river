"use client";
import React from 'react';
import { useForecast } from '../../hooks/useForecast';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function ForecastSummary() {
  const { forecast, selectedParameter, horizon } = useForecast();

  if (!forecast || !selectedParameter || forecast.status === 'INSUFFICIENT DATA') return null;

  const meta = PARAMETER_METADATA[selectedParameter];
  const current = forecast.historicalPoints.length > 0 ? forecast.historicalPoints[forecast.historicalPoints.length - 1].value : 0;
  const projected = forecast.forecastPoints.length > 0 ? forecast.forecastPoints[forecast.forecastPoints.length - 1].value : current;
  
  const TrendIcon = forecast.expectedTrend === 'Increasing' ? ArrowUpRight : forecast.expectedTrend === 'Decreasing' ? ArrowDownRight : Minus;
  const trendColor = forecast.expectedTrend === 'Increasing' ? 'text-amber-500' : forecast.expectedTrend === 'Decreasing' ? 'text-accent' : 'text-text-secondary';
  
  const isExceedance = forecast.status === 'PROJECTED EXCEEDANCE';

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 md:px-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Current Observation</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-slate-900 font-bold">{formatValue(current, meta.decimals)}</span>
          <span className="text-xs text-slate-500">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm border-l-4 border-l-amber-500">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Projected Endpoint ({horizon})</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-amber-600 font-bold">{formatValue(projected, meta.decimals)}</span>
          <span className="text-xs text-slate-500">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Expected Trend</div>
        <div className={`flex items-center gap-2 text-lg font-mono font-bold ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
          {forecast.expectedTrend}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm col-span-2 md:col-span-2 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 font-bold">Forecast Status</div>
          <div className="flex items-center gap-3 mb-2">
            {isExceedance ? (
              <>
                 <AlertTriangle className="w-6 h-6 text-rose-600" />
                 <div className="text-lg font-bold text-rose-600 tracking-wider">PROJECTED EXCEEDANCE</div>
              </>
            ) : (
              <>
                 <ShieldCheck className="w-6 h-6 text-emerald-600" />
                 <div className="text-lg font-bold text-emerald-700 tracking-wider">WITHIN LIMITS</div>
              </>
            )}
          </div>
        </div>
        <Link href="/intelligence" className="text-xs font-bold text-sky-600 hover:text-sky-700 uppercase tracking-widest flex items-center gap-1 transition-colors self-start mt-2">
          Forecast Interpretation &rarr;
        </Link>
      </div>
    </div>
  );
}
