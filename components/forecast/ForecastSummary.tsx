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
      <div className="bg-surface-elevated border border-border/50 rounded-xl p-4">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Current Observation</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-text-primary font-bold">{formatValue(current, meta.decimals)}</span>
          <span className="text-xs text-text-secondary">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-surface-elevated border border-border/50 rounded-xl p-4 border-l-2 border-l-amber-500/50">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Projected Endpoint ({horizon})</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-amber-500 font-bold">{formatValue(projected, meta.decimals)}</span>
          <span className="text-xs text-text-secondary">{meta.unit}</span>
        </div>
      </div>
      <div className="bg-surface-elevated border border-border/50 rounded-xl p-4">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Expected Trend</div>
        <div className={`flex items-center gap-2 text-lg font-mono font-bold ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
          {forecast.expectedTrend}
        </div>
      </div>
      <div className="bg-surface-elevated border border-border/50 rounded-xl p-4 col-span-2 md:col-span-2 flex flex-col justify-between">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Forecast Status</div>
          <div className="flex items-center gap-3 mb-2">
            {isExceedance ? (
              <>
                 <AlertTriangle className="w-6 h-6 text-red-500" />
                 <div className="text-lg font-bold text-red-500 tracking-wider">PROJECTED EXCEEDANCE</div>
              </>
            ) : (
              <>
                 <ShieldCheck className="w-6 h-6 text-accent" />
                 <div className="text-lg font-bold text-text-primary tracking-wider">WITHIN LIMITS</div>
              </>
            )}
          </div>
        </div>
        <Link href="/intelligence" className="text-xs font-semibold text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1 transition-colors self-start mt-2">
          Forecast Interpretation
        </Link>
      </div>
    </div>
  );
}
