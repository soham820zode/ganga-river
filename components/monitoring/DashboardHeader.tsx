"use client";
import React from 'react';
import { Activity } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';

export function DashboardHeader() {
  const { snapshot } = useSimulation();

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 md:px-8 border-b border-white/[0.06] backdrop-blur-xl bg-background/30 sticky top-16 z-40">
      <div>
        <h1 className="text-2xl font-bold tracking-[0.1em] text-text-primary uppercase flex items-center gap-3">
          River Monitoring
          {snapshot.status === 'RUNNING' && (
            <span className="flex items-center gap-1.5 text-[9px] bg-accent/10 text-accent px-3 py-1.5 rounded-xl border border-accent/20 animate-pulse-glow tracking-[0.2em]">
              <Activity className="w-3 h-3" />
              LIVE
            </span>
          )}
        </h1>
        <p className="text-sm text-text-secondary mt-2">See the pulse of the river as it changes across the demonstration network.</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col items-end">
        <div className="text-[9px] font-bold tracking-[0.3em] text-text-muted uppercase mb-1 font-mono">
          Simulated Data Stream
        </div>
        <div className="text-xs text-text-secondary font-mono">
          Last update: {new Date(snapshot.lastUpdateMs).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
