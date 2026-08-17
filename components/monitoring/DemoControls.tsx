"use client";
import React from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

export function DemoControls() {
  const { snapshot, start, pause, reset, injectAnomaly } = useSimulation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-elevated/95 backdrop-blur-md border-t border-border/50 p-2 md:p-4 z-50 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold tracking-widest text-text-muted uppercase hidden md:inline-block">Simulation Controls</span>
        <div className="flex bg-surface rounded-lg border border-border/50 overflow-hidden">
          <button 
            onClick={start} 
            disabled={snapshot.status === 'RUNNING'}
            className="p-2 hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-text-primary"
            title="Start"
          >
            <Play className="w-4 h-4" />
          </button>
          <div className="w-px bg-border/50"></div>
          <button 
            onClick={pause} 
            disabled={snapshot.status !== 'RUNNING'}
            className="p-2 hover:bg-surface-elevated disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-text-primary"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
          <div className="w-px bg-border/50"></div>
          <button 
            onClick={reset} 
            className="p-2 hover:bg-surface-elevated transition-colors text-red-500"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted hidden md:inline-block">Demo Scenarios:</span>
        <select 
          onChange={(e) => injectAnomaly(e.target.value as import('../../types/simulation').ScenarioType)}
          value={snapshot.activeScenario}
          className="bg-surface border border-border/50 text-text-primary text-xs rounded-md px-2 py-1 outline-none focus:border-accent/50"
        >
          <option value="NORMAL">Normal</option>
          <option value="BOD_SPIKE">BOD Spike (Kanpur, Varanasi)</option>
          <option value="TURBIDITY_SPIKE">Turbidity Spike</option>
          <option value="DO_DROP">DO Drop</option>
        </select>
        {snapshot.activeScenario !== 'NORMAL' && (
          <div className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded border border-amber-500/30 animate-pulse uppercase tracking-wider font-bold">
            <AlertTriangle className="w-3 h-3" />
            Active
          </div>
        )}
      </div>
    </div>
  );
}
