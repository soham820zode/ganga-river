"use client";
import React from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { ParameterType } from '../../types/water-quality';
import { formatValue, formatTimeAgo } from '../../lib/utils/formatters';
import { PARAMETER_METADATA } from '../../config/parameters';
import { StatusBadge } from '../ui/StatusBadge';

export function StationTable() {
  const { snapshot } = useSimulation();
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const stations = Object.values(snapshot.stations);

  const parameters: ParameterType[] = ['pH', 'DO', 'BOD', 'Temperature', 'Turbidity'];

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">Monitoring Network</h3>
      
      <div className="w-full overflow-x-auto rounded-xl border border-border/50 bg-surface custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 bg-surface-elevated text-xs uppercase tracking-wider text-text-muted">
              <th className="p-4 font-semibold whitespace-nowrap">Station</th>
              <th className="p-4 font-semibold whitespace-nowrap">Status</th>
              {parameters.map(p => (
                <th key={p} className="p-4 font-semibold whitespace-nowrap">{p} <span className="lowercase text-[10px]">({PARAMETER_METADATA[p].unit})</span></th>
              ))}
              <th className="p-4 font-semibold whitespace-nowrap">Last Update</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border/30">
            {stations.map(st => {
              const isSelected = selectedStationId === st.id;
              return (
                <tr 
                  key={st.id} 
                  onClick={() => setSelectedStation(isSelected ? null : st.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent/10 hover:bg-accent/15' : 'hover:bg-surface-elevated'
                  }`}
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-text-primary">{st.name}</div>
                    <div className="text-xs text-text-muted font-mono">{st.id}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <StatusBadge status={st.status as any} />
                  </td>
                  {parameters.map(p => {
                    const reading = st.readings[p];
                    if (!reading) return <td key={p} className="p-4 text-text-muted">—</td>;
                    return (
                      <td key={p} className="p-4 font-mono whitespace-nowrap">
                        <span className={`${reading.status === 'CRITICAL' ? 'text-red-500 font-bold' : reading.status === 'WARNING' ? 'text-amber-500 font-bold' : 'text-text-primary'}`}>
                          {formatValue(reading.value, PARAMETER_METADATA[p].decimals)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-4 text-xs text-text-muted font-mono whitespace-nowrap">
                    {formatTimeAgo(st.lastUpdated)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
