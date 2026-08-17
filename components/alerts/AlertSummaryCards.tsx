"use client";
import React from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AlertSummaryCards() {
  const alerts = useJalPulseStore(state => state.alerts);
  
  const activeCritical = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const activeWarning = alerts.filter(a => a.status === 'ACTIVE' && a.severity === 'WARNING').length;
  const resolved = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="aetheris-glass border-glow-red p-6 flex items-center gap-4 relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-critical/5 rounded-bl-full -mr-8 -mt-8" />
        <div className="p-3 bg-critical/10 text-critical rounded-xl border border-critical/15"><ShieldAlert className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-critical">{activeCritical}</div>
          <div className="text-[9px] tracking-[0.2em] text-text-muted uppercase mt-1 font-mono">Active Critical</div>
        </div>
      </div>

      <div className="aetheris-glass border-glow-amber p-6 flex items-center gap-4 relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-8 -mt-8" />
        <div className="p-3 bg-warning/10 text-warning rounded-xl border border-warning/15"><AlertTriangle className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-warning">{activeWarning}</div>
          <div className="text-[9px] tracking-[0.2em] text-text-muted uppercase mt-1 font-mono">Active Warnings</div>
        </div>
      </div>

      <div className="aetheris-glass p-6 flex items-center gap-4 rounded-2xl">
        <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/15"><ShieldCheck className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-text-primary">{resolved}</div>
          <div className="text-[9px] tracking-[0.2em] text-text-muted uppercase mt-1 font-mono">Resolved Events</div>
        </div>
      </div>
    </div>
  );
}
