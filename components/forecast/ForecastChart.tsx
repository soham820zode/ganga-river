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
    forecast.historicalPoints.slice(-100).forEach(pt => {
      combined.push({
        time: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    forecast.forecastPoints.forEach(pt => {
      combined.push({
        time: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const isF = payload[0].payload.isForecast;
                return (
                  <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-xl min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-slate-400 text-xs font-mono font-bold">{label}</p>
                       <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-lg uppercase ${isF ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                         {isF ? 'FORECAST' : 'HISTORICAL'}
                       </span>
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => {
                      if (entry.dataKey === 'lower' || entry.dataKey === 'upper') return null;
                      return (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span style={{ color: entry.color }} className="font-bold flex-1">{entry.name}</span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatValue(entry.value, meta.decimals)}
                            <span className="text-xs text-slate-500 ml-1">{meta.unit}</span>
                          </span>
                        </div>
                      )
                    })}
                    {isF && payload[0].payload.lower !== undefined && (
                       <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono font-medium">
                         Range: {formatValue(payload[0].payload.lower, meta.decimals)} – {formatValue(payload[0].payload.upper, meta.decimals)}
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
              opacity={0.6}
              label={{ position: 'insideTopLeft', value: 'REFERENCE THRESHOLD', fill: '#e11d48', fontSize: 10, fontWeight: 'bold' }}
            />
          )}

          {/* Uncertainty Band */}
          <Area 
            type="monotone" 
            dataKey="upper" 
            stroke="none" 
            fill="#f59e0b" 
            fillOpacity={0.15} 
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

          {/* Historical Line */}
          <Line 
            type="monotone" 
            dataKey="history" 
            name="Historical"
            stroke="#0284c7" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          
          {/* Forecast Line */}
          <Line 
            type="monotone" 
            dataKey="forecast" 
            name="Projected"
            stroke="#d97706" 
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 5, fill: "#d97706", stroke: "#ffffff", strokeWidth: 2 }}
            isAnimationActive={false}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
