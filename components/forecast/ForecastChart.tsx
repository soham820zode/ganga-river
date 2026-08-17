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
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-surface border-y border-border/50 text-text-muted p-8 text-center">
        <div className="text-xl mb-2 font-bold tracking-widest uppercase">Forecast Unavailable</div>
        <div className="text-sm">Insufficient historical data to calculate trend for this station. Allow the simulation to run longer.</div>
      </div>
    );
  }

  const meta = PARAMETER_METADATA[selectedParameter];

  return (
    <div className="w-full h-[500px] bg-surface border-y border-border/50 p-4 pt-8 relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={10} 
            tickMargin={10} 
            minTickGap={40}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={10} 
            domain={['auto', 'auto']}
            tickFormatter={(v) => formatValue(v, meta.decimals)}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const isF = payload[0].payload.isForecast;
                return (
                  <div className="bg-surface-elevated/95 backdrop-blur border border-border/50 rounded-lg p-3 shadow-2xl min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-text-muted text-xs font-mono">{label}</p>
                       <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase ${isF ? 'bg-amber-500/20 text-amber-500' : 'bg-accent/20 text-accent'}`}>
                         {isF ? 'FORECAST' : 'HISTORICAL'}
                       </span>
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => {
                      if (entry.dataKey === 'lower' || entry.dataKey === 'upper') return null; // Hide bounds from main tooltip list
                      return (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <span style={{ color: entry.color }} className="font-bold flex-1">{entry.name}</span>
                          <span className="font-mono font-bold text-text-primary">
                            {formatValue(entry.value, meta.decimals)}
                            <span className="text-xs text-text-secondary ml-1">{meta.unit}</span>
                          </span>
                        </div>
                      )
                    })}
                    {isF && payload[0].payload.lower !== undefined && (
                       <div className="mt-2 pt-2 border-t border-border/50 text-xs text-text-muted font-mono">
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
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              opacity={0.5}
              label={{ position: 'insideTopLeft', value: 'PROTOTYPE REFERENCE', fill: '#ef4444', fontSize: 10 }}
            />
          )}

          {/* Uncertainty Band */}
          <Area 
            type="monotone" 
            dataKey="upper" 
            stroke="none" 
            fill="#f59e0b" 
            fillOpacity={0.05} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="lower" 
            stroke="none" 
            fill="#0a111a" 
            fillOpacity={1} 
            isAnimationActive={false}
          />

          {/* Historical Line */}
          <Line 
            type="monotone" 
            dataKey="history" 
            name="Historical"
            stroke="#00e5ff" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#00e5ff", stroke: "#0a111a", strokeWidth: 2 }}
            isAnimationActive={false}
          />
          
          {/* Forecast Line */}
          <Line 
            type="monotone" 
            dataKey="forecast" 
            name="Projected"
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: "#f59e0b", stroke: "#0a111a", strokeWidth: 2 }}
            isAnimationActive={false}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
