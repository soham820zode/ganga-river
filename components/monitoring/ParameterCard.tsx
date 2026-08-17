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

  const statusColor = status === 'CRITICAL' ? 'text-rose-700 bg-rose-50 border-rose-200' : 
                      status === 'WARNING' ? 'text-amber-800 bg-amber-50 border-amber-200' : 
                      'text-emerald-700 bg-emerald-50 border-emerald-200';

  const valueColor = status === 'CRITICAL' ? 'text-rose-600' : 
                     status === 'WARNING' ? 'text-amber-700' : 
                     'text-slate-900';

  const TrendIcon = trend === 'UP' ? ArrowUpRight : trend === 'DOWN' ? ArrowDownRight : Minus;
  
  return (
    <button 
      onClick={() => setSelectedParameter(parameter)}
      className={`w-full text-left relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
        isSelected 
          ? `bg-white shadow-lg ring-2` 
          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-sm hover:shadow-md'
      }`}
      style={{
        borderColor: isSelected ? meta.accentHex : undefined,
        boxShadow: isSelected ? `0 10px 25px -5px ${meta.accentHex}20` : undefined,
        // @ts-expect-error CSS custom property for ring color
        '--tw-ring-color': `${meta.accentHex}40`,
      }}
    >
      {/* Top feature color accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 transition-opacity" 
        style={{ backgroundColor: meta.accentHex, opacity: isSelected ? 1 : 0.4 }} 
      />

      <div className="flex justify-between items-start mb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${meta.lightBg} ${meta.lightText} border ${meta.lightBorder}`}>
            {meta.key.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{meta.displayName}</h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-mono font-medium">{isStationSpecific ? 'Station Value' : 'Corridor Avg'}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border ${statusColor}`}>
          {StatusIcon && <StatusIcon className="w-3 h-3" />}
          <span>{status}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-3xl font-mono font-bold ${valueColor}`}>{formatValue(value, meta.decimals)}</span>
        <span className="text-sm text-slate-500 font-semibold">{meta.unit}</span>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <TrendIcon className="w-4 h-4" style={{ color: meta.accentHex }} />
          <span className="capitalize text-[10px] tracking-wider font-semibold">{trend.toLowerCase()} trend</span>
        </div>
        <div className="text-slate-400 font-mono text-[10px] font-medium">{formatTimeAgo(lastUpdated)}</div>
      </div>
    </button>
  );
}
