"use client";
import React from 'react';
import { ParameterType, WaterQualityStatus, TrendDirection } from '../../types/water-quality';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue, formatTimeAgo } from '../../lib/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';
import { useJalPulseStore } from '../../store/useJalPulseStore';

interface Props {
  parameter: ParameterType;
  value: number;
  status: WaterQualityStatus;
  trend: TrendDirection;
  lastUpdated: string;
  isStationSpecific: boolean;
}

export function ParameterCard({ parameter, value, status, trend, lastUpdated, isStationSpecific }: Props) {
  const meta = PARAMETER_METADATA[parameter];
  const selectedParameter = useJalPulseStore(state => state.selectedParameter);
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const isSelected = selectedParameter === parameter;

  const StatusIcon = status === 'CRITICAL' || status === 'WARNING' ? AlertTriangle : null;
  
  const glowClass = status === 'CRITICAL' ? 'border-glow-red' : 
                    status === 'WARNING' ? 'border-glow-amber' : 
                    'border-glow-cyan';

  const statusColor = status === 'CRITICAL' ? 'text-critical bg-critical/10 border-critical/25' : 
                      status === 'WARNING' ? 'text-warning bg-warning/10 border-warning/25' : 
                      'text-accent bg-accent/10 border-accent/25';

  const valueColor = status === 'CRITICAL' ? 'text-critical text-glow' : 
                     status === 'WARNING' ? 'text-warning' : 
                     'text-text-primary';

  const TrendIcon = trend === 'UP' ? ArrowUpRight : trend === 'DOWN' ? ArrowDownRight : Minus;
  
  return (
    <button 
      onClick={() => setSelectedParameter(parameter)}
      className={`w-full text-left relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        isSelected 
          ? `aetheris-glass border-accent/40 shadow-[0_0_30px_rgba(0,200,255,0.12)] ${glowClass}` 
          : 'aetheris-glass hover:border-white/15'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary tracking-wider">{meta.key}</h3>
          <p className="text-[9px] text-text-muted uppercase mt-1 tracking-[0.15em] font-mono">{isStationSpecific ? 'Station Value' : 'Network Avg'}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] border ${statusColor}`}>
          {StatusIcon && <StatusIcon className="w-3 h-3" />}
          <span>{status}</span>
          <span className="sr-only">Status: {status}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-3xl font-mono font-bold ${valueColor}`}>{formatValue(value, meta.decimals)}</span>
        <span className="text-sm text-text-secondary/70">{meta.unit}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <TrendIcon className="w-4 h-4" />
          <span className="capitalize text-[10px] tracking-wider">{trend.toLowerCase()}</span>
        </div>
        <div className="text-text-muted font-mono text-[10px]">{formatTimeAgo(lastUpdated)}</div>
      </div>
    </button>
  );
}
