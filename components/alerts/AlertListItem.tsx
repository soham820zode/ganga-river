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
    <div className={`w-full aetheris-glass rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${
      isActive ? glowClass : 'opacity-70'
    }`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`p-3 rounded-xl flex-shrink-0 flex items-start self-start ${isActive ? `${bgColorClass} ${colorClass} border ${borderColorClass}` : 'bg-white/[0.03] text-text-muted border border-white/[0.06]'}`}>
          {alert.status === 'RESOLVED' ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[9px] font-bold tracking-[0.2em] px-3 py-1 rounded-lg uppercase ${
              isActive ? `${bgColorClass} ${colorClass} border ${borderColorClass}` : 'bg-white/[0.04] border border-white/[0.06] text-text-muted'
            }`}>
              {alert.status === 'ACTIVE' ? alert.severity : alert.status}
            </span>
            <span className="text-[10px] font-mono text-text-secondary bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg">
              {alert.stationId}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-text-muted ml-auto flex items-center gap-1 font-mono">
               <Clock className="w-3 h-3" /> {new Date(alert.updatedAt).toLocaleTimeString()}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed mb-4 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
            {alert.message}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-text-muted uppercase tracking-[0.15em] text-[8px] mb-0.5">Current</span>
              <span className={isActive ? `${colorClass} font-bold` : 'text-text-primary'}>
                {formatValue(alert.currentValue, meta.decimals)} {meta.unit}
              </span>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex flex-col">
              <span className="text-text-muted uppercase tracking-[0.15em] text-[8px] mb-0.5">Reference</span>
              <span className="text-text-secondary">{alert.referenceThreshold} {meta.unit}</span>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex flex-col">
              <span className="text-text-muted uppercase tracking-[0.15em] text-[8px] mb-0.5">Occurrences</span>
              <span className="text-text-secondary">{alert.occurrences}x</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end md:justify-center border-t md:border-t-0 md:border-l border-white/[0.06] pt-4 md:pt-0 md:pl-4">
          {isActive && (
            <button 
              onClick={() => acknowledgeAlert(alert.id)}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all text-text-primary"
            >
              Acknowledge
            </button>
          )}
          {(alert.status === 'ACTIVE' || alert.status === 'ACKNOWLEDGED') && (
            <button 
              onClick={() => resolveAlert(alert.id)}
              className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-all text-text-secondary"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 mx-1">
        <span className="text-[10px] text-text-secondary flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent" />
          Powered by Aetheris Environmental Intelligence
        </span>
        <Link href={`/intelligence`} className="text-[10px] font-bold text-accent hover:text-accent-hover uppercase tracking-[0.15em] flex items-center gap-1 transition-colors">
          Why this alert?
        </Link>
      </div>

      <ResponseTimeline alertId={alert.id} />
    </div>
  );
}
