"use client";
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useForecast } from '../../hooks/useForecast';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';

export function ForecastChart() {
  const { forecast, selectedParameter } = useForecast();

  const data = useMemo(() => {
    if (!forecast) return [];
    
    const combined: Record<string, string | number | boolean>[] = [];
    
    // Historical points (downsampled again just for display limits)
    forecast.historicalPoints.slice(-100).forEach((pt, index) => {
      combined.push({
        uniqueKey: `hist-${pt.timestamp}-${index}`,
        time: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: new Date(pt.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: pt.timestamp,
        history: pt.value,
        isForecast: false
      });
    });

    // Connector point to bridge the gap
    if (combined.length > 0 && forecast.forecastPoints.length > 0) {
       const lastHist = combined[combined.length - 1];
       lastHist.forecast = lastHist.history;
       lastHist.lower = lastHist.history;
       lastHist.upper = lastHist.history;
    }

    // Forecast points
    forecast.forecastPoints.forEach((pt, index) => {
      combined.push({
        uniqueKey: `fc-${pt.timestamp}-${index}`,
        time: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: new Date(pt.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: pt.timestamp,
        forecast: pt.value,
        lower: pt.lowerBound,
        upper: pt.upperBound,
        isForecast: true
      });
    });

    return combined;
  }, [forecast]);

  if (!forecast || !selectedParameter || forecast.status === 'INSUFFICIENT DATA') {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-white border-y border-slate-200 text-slate-400 p-8 text-center">
        <div className="text-xl mb-2 font-bold tracking-widest uppercase text-slate-800">Forecast Unavailable</div>
        <div className="text-sm text-slate-500">Insufficient historical data to calculate trend for this station. Allow the simulation to run longer.</div>
      </div>
    );
  }

  const meta = PARAMETER_METADATA[selectedParameter];
  const featureColor = meta.color || '#0284c7';

  return (
    <div className="w-full h-[500px] bg-white border-y border-slate-200 p-4 pt-8 relative shadow-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickMargin={10} 
            minTickGap={40}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            domain={['auto', 'auto']}
            tickFormatter={(v) => formatValue(v, meta.decimals)}
          />
          <Tooltip 
            cursor={{ stroke: featureColor, strokeWidth: 1.5, strokeDasharray: '3 3' }}
            filterNull={true}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const isF = item.isForecast;
                return (
                  <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-xl min-w-[220px]">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-slate-400 text-xs font-mono font-bold">{item.fullTime || item.time}</p>
                       <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-lg uppercase ${isF ? 'bg-amber-50 text-amber-700 border border-amber-200' : `${meta.lightBg} ${meta.lightText} border ${meta.lightBorder}`}`}>
                         {isF ? '48H FORECAST' : 'TELEMETRY'}
                       </span>
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => {
                      if (entry.dataKey === 'lower' || entry.dataKey === 'upper') return null;
                      return (
                        <div key={index} className="flex items-center gap-3 text-sm py-0.5">
                          <span style={{ color: entry.color }} className="font-bold flex-1">{entry.name}</span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatValue(entry.value, meta.decimals)}
                            <span className="text-xs text-slate-500 ml-1">{meta.unit}</span>
                          </span>
                        </div>
                      );
                    })}
                    {isF && item.lower !== undefined && (
                       <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono font-medium">
                         95% Band: {formatValue(item.lower, meta.decimals)} – {formatValue(item.upper, meta.decimals)} {meta.unit}
                       </div>
                    )}
                  </div>
                );
              }
              return null;
            }} 
          />
          
          {forecast.referenceThreshold !== undefined && !isNaN(forecast.referenceThreshold) && (
            <ReferenceLine 
              y={forecast.referenceThreshold} 
              stroke="#e11d48" 
              strokeDasharray="4 4" 
              opacity={0.7}
              label={{ position: 'insideTopLeft', value: `REFERENCE (${meta.reference})`, fill: '#e11d48', fontSize: 10, fontWeight: 'bold' }}
            />
          )}

          {/* Uncertainty Band */}
          <Area 
            type="monotone" 
            dataKey="upper" 
            stroke="none" 
            fill={featureColor} 
            fillOpacity={0.12} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="lower" 
            stroke="none" 
            fill="#ffffff" 
            fillOpacity={1} 
            isAnimationActive={false}
          />

          {/* Historical Telemetry Line */}
          <Line 
            type="monotone" 
            dataKey="history" 
            name="Measured"
            stroke={featureColor} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: featureColor, stroke: "#ffffff", strokeWidth: 2.5 }}
            isAnimationActive={false}
          />
          
          {/* Forecast Projected Line */}
          <Line 
            type="monotone" 
            dataKey="forecast" 
            name="Forecasted"
            stroke={featureColor} 
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
            activeDot={{ r: 6, fill: featureColor, stroke: "#ffffff", strokeWidth: 2.5 }}
            isAnimationActive={false}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
