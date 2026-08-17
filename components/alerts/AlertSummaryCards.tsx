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
      <div className="bg-white border border-rose-200 p-6 flex items-center gap-4 relative overflow-hidden rounded-2xl shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-8 -mt-8" />
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-200"><ShieldAlert className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-rose-600">{activeCritical}</div>
          <div className="text-[10px] tracking-[0.15em] text-slate-500 uppercase mt-1 font-mono font-bold">Active Critical</div>
        </div>
      </div>

      <div className="bg-white border border-amber-200 p-6 flex items-center gap-4 relative overflow-hidden rounded-2xl shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-8 -mt-8" />
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200"><AlertTriangle className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-amber-600">{activeWarning}</div>
          <div className="text-[10px] tracking-[0.15em] text-slate-500 uppercase mt-1 font-mono font-bold">Active Warnings</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 flex items-center gap-4 rounded-2xl shadow-sm">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200"><ShieldCheck className="w-8 h-8" /></div>
        <div>
          <div className="text-3xl font-mono font-bold text-slate-900">{resolved}</div>
          <div className="text-[10px] tracking-[0.15em] text-slate-500 uppercase mt-1 font-mono font-bold">Resolved Events</div>
        </div>
      </div>
    </div>
  );
}
