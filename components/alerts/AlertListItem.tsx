"use client";
import React from 'react';
import { Alert } from '../../types/alerts';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Clock, Brain } from 'lucide-react';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue } from '../../lib/utils/formatters';
import { ResponseTimeline } from '../response/ResponseTimeline';
import Link from 'next/link';

export function AlertListItem({ alert }: { alert: Alert }) {
  const acknowledgeAlert = useJalPulseStore(state => state.acknowledgeAlert);
  const resolveAlert = useJalPulseStore(state => state.resolveAlert);
  
  const isCrit = alert.severity === 'CRITICAL';
  const isWarn = alert.severity === 'WARNING';
  const isActive = alert.status === 'ACTIVE';
  
  const Icon = isCrit ? ShieldAlert : isWarn ? AlertTriangle : Info;
  
  const glowClass = isCrit ? 'border-glow-red' : isWarn ? 'border-glow-amber' : 'border-glow-cyan';
  const colorClass = isCrit ? 'text-critical' : isWarn ? 'text-warning' : 'text-info';
  const bgColorClass = isCrit ? 'bg-critical/10' : isWarn ? 'bg-warning/10' : 'bg-info/10';
  const borderColorClass = isCrit ? 'border-critical/20' : isWarn ? 'border-warning/20' : 'border-info/20';
  
  const meta = PARAMETER_METADATA[alert.parameter];

  return (
    <div className={`w-full bg-white border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 shadow-sm ${
      isActive ? 'border-slate-300' : 'opacity-80 border-slate-200 bg-slate-50/50'
    }`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 flex items-start self-start ${
          isCrit ? 'bg-rose-50 text-rose-600 border border-rose-200' :
          isWarn ? 'bg-amber-50 text-amber-600 border border-amber-200' :
          'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {alert.status === 'RESOLVED' ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <Icon className="w-6 h-6" />}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[9px] font-bold tracking-[0.15em] px-3 py-1 rounded-lg uppercase border ${
              isCrit ? 'bg-rose-50 text-rose-700 border-rose-200' :
              isWarn ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {alert.status === 'ACTIVE' ? alert.severity : alert.status}
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-bold">
              {alert.stationId}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-slate-400 ml-auto flex items-center gap-1 font-mono">
               <Clock className="w-3 h-3" /> {new Date(alert.updatedAt).toLocaleTimeString()}
            </span>
          </div>
          
          <p className="text-sm leading-relaxed mb-4 text-slate-800 font-medium">
            {alert.message}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase tracking-[0.15em] text-[8px] mb-0.5 font-bold">Current</span>
              <span className={isCrit ? 'text-rose-600 font-bold' : isWarn ? 'text-amber-600 font-bold' : 'text-slate-900 font-bold'}>
                {formatValue(alert.currentValue, meta.decimals)} {meta.unit}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase tracking-[0.15em] text-[8px] mb-0.5 font-bold">Reference</span>
              <span className="text-slate-600">{alert.referenceThreshold} {meta.unit}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase tracking-[0.15em] text-[8px] mb-0.5 font-bold">Occurrences</span>
              <span className="text-slate-600">{alert.occurrences}x</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end md:justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
          {isActive && (
            <button 
              onClick={() => acknowledgeAlert(alert.id)}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs"
            >
              Acknowledge
            </button>
          )}
          {(alert.status === 'ACTIVE' || alert.status === 'ACKNOWLEDGED') && (
            <button 
              onClick={() => resolveAlert(alert.id)}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all text-slate-700 font-semibold"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 mx-1">
        <span className="text-[10px] text-slate-600 flex items-center gap-2 font-medium">
          <Brain className="w-4 h-4 text-sky-600" />
          Powered by Jal Pulse Environmental Intelligence
        </span>
        <Link href={`/intelligence`} className="text-[10px] font-bold text-sky-600 hover:text-sky-700 uppercase tracking-[0.15em] flex items-center gap-1 transition-colors">
          Why this alert? &rarr;
        </Link>
      </div>

      <ResponseTimeline alertId={alert.id} />
    </div>
  );
}
