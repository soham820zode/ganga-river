"use client";
import React from 'react';
import { Activity } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';

export function DashboardHeader() {
  const { snapshot } = useSimulation();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-8 border-b border-slate-200/80 backdrop-blur-xl bg-white/70 sticky top-16 z-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-3">
          River Monitoring
          {snapshot.status === 'RUNNING' && (
            <span className="flex items-center gap-1.5 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-xl border border-emerald-200 shadow-sm tracking-widest">
              <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
              LIVE TELEMETRY
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-600 mt-1">Real-time parameters, station intelligence, and water quality telemetry across the Ganga river network.</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
        <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-0.5 font-mono">
          Simulated Data Stream
        </div>
        <div suppressHydrationWarning className="text-xs text-slate-600 font-mono font-medium">
          Last update: {mounted ? new Date(snapshot.lastUpdateMs).toLocaleTimeString() : 'Live'}
        </div>
      </div>
    </div>
  );
}
