"use client";
import React from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

export function DemoControls() {
  const { snapshot, start, pause, reset, injectAnomaly } = useSimulation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 md:p-4 z-40 flex items-center justify-between text-sm shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase hidden md:inline-block">Simulation Controls</span>
        <div className="flex bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <button 
            onClick={start} 
            disabled={snapshot.status === 'RUNNING'}
            className="p-2 hover:bg-slate-200/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-800"
            title="Start"
          >
            <Play className="w-4 h-4" />
          </button>
          <div className="w-px bg-slate-200"></div>
          <button 
            onClick={pause} 
            disabled={snapshot.status !== 'RUNNING'}
            className="p-2 hover:bg-slate-200/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-800"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
          <div className="w-px bg-slate-200"></div>
          <button 
            onClick={reset} 
            className="p-2 hover:bg-slate-200/80 transition-colors text-rose-600"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 hidden md:inline-block font-medium">Demo Scenarios:</span>
        <select 
          onChange={(e) => injectAnomaly(e.target.value as import('../../types/simulation').ScenarioType)}
          value={snapshot.activeScenario}
          className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-1.5 outline-none focus:border-sky-500 shadow-xs"
        >
          <option value="NORMAL">Normal Flow</option>
          <option value="BOD_SPIKE">BOD Spike (Kanpur, Varanasi)</option>
          <option value="TURBIDITY_SPIKE">Turbidity Spike</option>
          <option value="DO_DROP">Dissolved Oxygen Drop</option>
        </select>
        {snapshot.activeScenario !== 'NORMAL' && (
          <div className="flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 animate-pulse uppercase tracking-wider font-bold shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Active
          </div>
        )}
      </div>
    </div>
  );
}
