"use client";
import React from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { Navbar } from '../../components/navigation/Navbar';

export default function SimulationPage() {
  const { snapshot, start, pause, reset, injectAnomaly } = useSimulation();

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />
      <div className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-4">Simulation Engine Debug</h1>
        
        <div className="flex gap-4 mb-8">
          <button onClick={start} disabled={snapshot.status === 'RUNNING'} className="px-4 py-2 bg-accent text-background rounded font-bold disabled:opacity-50">Start</button>
          <button onClick={pause} disabled={snapshot.status !== 'RUNNING'} className="px-4 py-2 border border-accent text-accent rounded font-bold disabled:opacity-50">Pause</button>
          <button onClick={reset} className="px-4 py-2 border border-red-500 text-red-500 rounded font-bold">Reset</button>
          <button onClick={() => injectAnomaly('BOD_SPIKE')} className="px-4 py-2 bg-amber-500 text-background rounded font-bold ml-auto">Inject BOD Spike (Demo)</button>
          <button onClick={() => injectAnomaly('NORMAL')} className="px-4 py-2 border border-border rounded font-bold">Clear Anomaly</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          <div className="p-4 bg-surface rounded border border-border/50">Status: <span className="font-mono text-accent">{snapshot.status}</span></div>
          <div className="p-4 bg-surface rounded border border-border/50">Scenario: <span className="font-mono text-accent">{snapshot.activeScenario}</span></div>
          <div className="p-4 bg-surface rounded border border-border/50">Last Update: <span suppressHydrationWarning className="font-mono">{new Date(snapshot.lastUpdateMs).toLocaleTimeString()}</span></div>
          <div className="p-4 bg-surface rounded border border-border/50">Stations: <span className="font-mono">{snapshot.networkSummary.stationCount}</span></div>
        </div>

        <div className="space-y-4">
          {Object.values(snapshot.stations).map(st => (
            <div key={st.id} className="p-4 bg-surface rounded border border-border/50">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">{st.name} <span className="text-xs text-text-muted font-mono">{st.id}</span></h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${st.status === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : st.status === 'WARNING' ? 'bg-amber-500/20 text-amber-500' : 'bg-accent/20 text-accent'}`}>
                  {st.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.values(st.readings).map(r => r && (
                  <div key={r.parameter} className={`p-2 rounded border ${r.isAnomaly ? 'border-amber-500 bg-amber-500/10' : 'border-border/20 bg-background/50'}`}>
                    <div className="text-xs text-text-muted mb-1">{r.parameter}</div>
                    <div className="text-lg font-mono">{r.value} <span className="text-xs text-text-muted">{r.unit}</span></div>
                    <div className="text-[10px] text-text-secondary mt-1">{r.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
