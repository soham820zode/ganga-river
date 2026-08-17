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
      <div className="w-full h-[500px] flex items-center justify-center bg-surface border-y border-border/50 text-text-muted">
        Waiting for simulation data...
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

  const colors = ['#00e5ff', '#ff3366', '#a855f7', '#10b981', '#f59e0b'];

  return (
    <div className="w-full h-[500px] bg-surface border-y border-border/50 p-4 pt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={10} 
            tickMargin={10} 
            minTickGap={30}
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
                return (
                  <div className="bg-surface-elevated/95 backdrop-blur border border-border/50 rounded-lg p-3 shadow-2xl">
                    <p className="text-text-muted text-xs mb-2 font-mono">{label}</p>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span style={{ color: entry.color }} className="font-bold flex-1">{entry.name}</span>
                        <span className="font-mono font-bold text-text-primary">
                          {formatValue(entry.value, meta.decimals)}
                          <span className="text-xs text-text-secondary ml-1">{meta.unit}</span>
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
              stroke="#f59e0b" 
              strokeDasharray="4 4" 
              opacity={0.5}
              label={{ position: 'insideTopLeft', value: 'PROTOTYPE REFERENCE', fill: '#f59e0b', fontSize: 10 }}
            />
          )}

          {analyticsMode === 'STATION' ? (
            <Line 
              type="monotone" 
              dataKey="value" 
              name={selectedStationId || 'Value'}
              stroke="#00e5ff" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#00e5ff", stroke: "#0a111a", strokeWidth: 2 }}
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
                  strokeWidth={1}
                  opacity={0.3}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
              <Line 
                type="monotone" 
                dataKey="Average" 
                name="Network Average"
                stroke="#00e5ff" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#00e5ff", stroke: "#0a111a", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
