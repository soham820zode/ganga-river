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
      <h3 className="text-xs font-bold tracking-[0.2em] text-sky-600 mb-4 uppercase">Monitoring Network Table</h3>
      
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4 whitespace-nowrap">Station</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              {parameters.map(p => {
                const meta = PARAMETER_METADATA[p];
                return (
                  <th key={p} className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentHex }} />
                      <span>{p}</span>
                      <span className="lowercase text-[10px] text-slate-400 font-normal">({meta.unit})</span>
                    </div>
                  </th>
                );
              })}
              <th className="p-4 whitespace-nowrap">Last Update</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {stations.map(st => {
              const isSelected = selectedStationId === st.id;
              return (
                <tr 
                  key={st.id} 
                  onClick={() => setSelectedStation(isSelected ? null : st.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-sky-50/90 hover:bg-sky-100/70 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{st.id}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <StatusBadge status={st.status as any} />
                  </td>
                  {parameters.map(p => {
                    const reading = st.readings[p];
                    const meta = PARAMETER_METADATA[p];
                    if (!reading) return <td key={p} className="p-4 text-slate-400">—</td>;
                    return (
                      <td key={p} className="p-4 font-mono whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          reading.status === 'CRITICAL' ? 'text-rose-700 bg-rose-50 border border-rose-200' : 
                          reading.status === 'WARNING' ? 'text-amber-700 bg-amber-50 border border-amber-200' : 
                          'text-slate-800'
                        }`}>
                          {formatValue(reading.value, meta.decimals)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-4 text-xs text-slate-500 font-mono whitespace-nowrap">
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
