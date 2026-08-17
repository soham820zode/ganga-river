"use client";
import React, { useEffect, useState } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

// Initialize the engine globally once this mounts
import '../../lib/alerts/alertEngine';

export function AlertToastManager() {
  const alerts = useJalPulseStore(state => state.alerts);
  const [visibleToast, setVisibleToast] = useState<string | null>(null);
  
  // Track previously seen so we only toast new ones or escalations
  const [seen, setSeen] = useState<Record<string, 'WARNING'|'CRITICAL'>>({});

  useEffect(() => {
    // Find the latest active critical or warning alert that we haven't toasted at this severity
    const latest = alerts.find(a => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'WARNING'));
    
    if (latest) {
      if (seen[latest.id] !== latest.severity) {
         setTimeout(() => {
           setVisibleToast(latest.id);
           setSeen(prev => ({ ...prev, [latest.id]: latest.severity as 'WARNING' | 'CRITICAL' }));
         }, 0);
         
         // Auto dismiss after 5s
         const timer = setTimeout(() => {
           setVisibleToast(null);
         }, 5000);
         return () => clearTimeout(timer);
      }
    }
  }, [alerts, seen]);

  if (!visibleToast) return null;
  const alert = alerts.find(a => a.id === visibleToast);
  if (!alert) return null;

  const isCrit = alert.severity === 'CRITICAL';
  const Icon = isCrit ? ShieldAlert : AlertTriangle;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`w-80 rounded-xl shadow-2xl border p-4 flex gap-4 ${
        isCrit ? 'bg-red-950/90 border-red-500/50 text-red-50' : 'bg-amber-950/90 border-amber-500/50 text-amber-50'
      }`}>
        <div className={`mt-1 ${isCrit ? 'text-red-500' : 'text-amber-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-sm tracking-wider uppercase">{alert.severity} ALERT</h4>
            <button onClick={() => setVisibleToast(null)} className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs opacity-90 mb-2 leading-relaxed">
            {alert.message}
          </p>
          <div className="flex justify-between items-center mt-3">
             <span className="text-[9px] font-mono tracking-widest uppercase opacity-70 bg-black/20 px-2 py-1 rounded">SIMULATED DATA</span>
             <Link href="/alerts" onClick={() => setVisibleToast(null)} className="text-xs font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">
               View Details
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
