"use client";
import React, { useState } from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { AlertSummaryCards } from '../../components/alerts/AlertSummaryCards';
import { AlertListItem } from '../../components/alerts/AlertListItem';
import { DemoControls } from '../../components/monitoring/DemoControls';

export default function AlertsPage() {
  const alerts = useJalPulseStore(state => state.alerts);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const filtered = alerts.filter(a => {
    if (filter === 'ACTIVE') return a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED';
    if (filter === 'RESOLVED') return a.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 md:px-8 border-b border-white/[0.06] backdrop-blur-xl bg-background/30">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.1em] text-text-primary uppercase">
            Alert Intelligence
          </h1>
          <p className="text-[10px] text-text-secondary mt-2 font-mono tracking-[0.3em] uppercase">ANOMALY DETECTION & ALERT MANAGEMENT</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-white/[0.04] text-text-muted border border-white/[0.08] px-4 py-1.5 rounded-xl uppercase">
            Simulated Workflow
          </span>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <AlertSummaryCards />

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6 border-b border-white/[0.06] pb-5">
           {['ALL', 'ACTIVE', 'RESOLVED'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as 'ALL' | 'ACTIVE' | 'RESOLVED')}
               className={`px-5 py-2 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-200 ${
                 filter === f 
                   ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_12px_rgba(0,200,255,0.08)]' 
                   : 'text-text-muted hover:text-text-secondary border border-transparent hover:bg-white/[0.03]'
               }`}
             >
               {f}
             </button>
           ))}
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center p-16 aetheris-glass text-text-muted">
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold mb-2">No Alerts Found</div>
              <div className="text-xs text-text-muted/60">System is operating within normal parameters.</div>
            </div>
          ) : (
            filtered.map(alert => (
              <AlertListItem key={alert.id} alert={alert} />
            ))
          )}
        </div>
      </div>
      
      <DemoControls />
    </div>
  );
}
