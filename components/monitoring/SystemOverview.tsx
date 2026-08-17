"use client";
import React from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { GlassPanel } from '../ui/GlassPanel';
import { Server, Clock, Database, ActivitySquare } from 'lucide-react';
import { simulationConfig } from '../../config/simulation';

export function SystemOverview() {
  const { snapshot } = useSimulation();

  const cards = [
    {
      icon: <Database className="w-5 h-5 text-accent" />,
      label: 'Stations',
      value: `${snapshot.networkSummary.stationCount} DEMO`,
    },
    {
      icon: <Clock className="w-5 h-5 text-accent" />,
      label: 'Update Interval',
      value: `${simulationConfig.updateIntervalMs / 1000} SEC`,
    },
    {
      icon: <Server className="w-5 h-5 text-accent" />,
      label: 'Data Mode',
      value: 'SIMULATED',
    },
    {
      icon: <ActivitySquare className="w-5 h-5 text-accent" />,
      label: 'Network Status',
      value: 'OPERATIONAL',
      isLive: true,
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 py-6">
      {cards.map((card, i) => (
        <GlassPanel key={i} className="p-5 flex items-center gap-4 rounded-2xl bg-white shadow-sm border border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 shadow-sm text-sky-600">
            {card.icon}
          </div>
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono font-medium">{card.label}</div>
            <div className={`font-mono text-base font-bold text-slate-900 flex items-center gap-2 ${card.isLive ? 'text-sky-600' : ''}`}>
              {card.isLive && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse"></span>}
              {card.value}
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
