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
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-8 border-b border-slate-200/80 backdrop-blur-xl bg-white/70">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            Alert Intelligence
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 font-mono tracking-[0.2em] uppercase font-bold">REAL-TIME ANOMALY DETECTION & RESPONSE</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-slate-100 text-slate-600 border border-slate-200 px-3.5 py-1.5 rounded-xl uppercase shadow-xs">
            Live Stream
          </span>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <AlertSummaryCards />

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-5">
           {['ALL', 'ACTIVE', 'RESOLVED'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as 'ALL' | 'ACTIVE' | 'RESOLVED')}
               className={`px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase rounded-xl transition-all duration-200 ${
                 filter === f 
                   ? 'bg-slate-900 text-white shadow-sm' 
                   : 'text-slate-600 hover:text-slate-900 border border-transparent hover:bg-slate-100'
               }`}
             >
               {f}
             </button>
           ))}
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center p-16 bg-white border border-slate-200 rounded-3xl shadow-sm text-slate-400">
              <div className="text-sm uppercase tracking-[0.2em] font-bold mb-1 text-slate-700">No Alerts Found</div>
              <div className="text-xs text-slate-500">System is operating within normal environmental parameters.</div>
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
