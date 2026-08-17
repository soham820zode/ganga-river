"use client";
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { getHistoryForRange, downsampleTimeSeries } from '../../lib/utils/analytics';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';

export function HistoricalChart() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const analyticsTimeRange = useJalPulseStore(state => state.analyticsTimeRange);
  const analyticsMode = useJalPulseStore(state => state.analyticsMode);
  const { history } = useSimulation();

  const data = useMemo(() => {
    if (!selectedParameter) return [];
    
    if (analyticsMode === 'STATION') {
      const raw = getHistoryForRange(history, selectedStationId, selectedParameter, analyticsTimeRange);
      return downsampleTimeSeries(raw, 200).map(d => ({
        time: new Date(d.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: d.t,
        value: d.v
      }));
    } else {
      // Network Mode: plot all stations separately + average
      const allStations = Object.keys(history);
      if (!allStations.length) return [];
      
      const rawRef = getHistoryForRange(history, allStations[0], selectedParameter, analyticsTimeRange);
      const downsampledRef = downsampleTimeSeries(rawRef, 200);
      
      return downsampledRef.map((refPoint) => {
        const row: Record<string, string | number> = { 
          time: new Date(refPoint.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: refPoint.t 
        };
        let sum = 0;
        let count = 0;
        allStations.forEach(stId => {
          const stData = history[stId]?.[selectedParameter] || [];
          const match = stData.find(d => Math.abs(d.t - refPoint.t) < 5000);
          if (match) {
            row[stId] = match.v;
            sum += match.v;
            count++;
          }
        });
        row['Average'] = count > 0 ? sum / count : 0;
        return row;
      });
    }
  }, [history, selectedParameter, selectedStationId, analyticsTimeRange, analyticsMode]);

  if (!selectedParameter || !data.length) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white border-y border-slate-200 text-slate-400 font-medium">
        Waiting for stream telemetry data...
      </div>
    );
  }

  const meta = PARAMETER_METADATA[selectedParameter];
  
  // Parse reference threshold for ReferenceLine
  let refVal: number | undefined;
  if (meta.reference.includes('<') || meta.reference.includes('≤')) {
    refVal = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
  } else if (meta.reference.includes('>')) {
    refVal = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
  }

  const colors = ['#0284c7', '#e11d48', '#8b5cf6', '#059669', '#d97706'];

  return (
    <div className="w-full h-[500px] bg-white border-y border-slate-200 p-4 pt-8 shadow-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickMargin={10} 
            minTickGap={30}
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
                return (
                  <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-xl">
                    <p className="text-slate-400 text-xs mb-2 font-mono font-bold">{label}</p>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span style={{ color: entry.color }} className="font-bold flex-1">{entry.name}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatValue(entry.value, meta.decimals)}
                          <span className="text-xs text-slate-500 ml-1">{meta.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }} 
          />
          
          {refVal !== undefined && !isNaN(refVal) && (
            <ReferenceLine 
              y={refVal} 
              stroke="#d97706" 
              strokeDasharray="4 4" 
              opacity={0.7}
              label={{ position: 'insideTopLeft', value: 'REFERENCE BENCHMARK', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }}
            />
          )}

          {analyticsMode === 'STATION' ? (
            <Line 
              type="monotone" 
              dataKey="value" 
              name={selectedStationId || 'Value'}
              stroke="#0284c7" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ) : (
            <>
              {Object.keys(history).map((stId, i) => (
                <Line 
                  key={stId}
                  type="monotone" 
                  dataKey={stId} 
                  name={stId}
                  stroke={colors[i % colors.length]} 
                  strokeWidth={1.5}
                  opacity={0.35}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
              <Line 
                type="monotone" 
                dataKey="Average" 
                name="Network Average"
                stroke="#0284c7" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
