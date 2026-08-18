"use client";
import React from 'react';
import { ParameterType, WaterQualityStatus, TrendDirection } from '../../types/water-quality';
import { PARAMETER_METADATA } from '../../config/parameters';
import { formatValue, formatTimeAgo } from '../../lib/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Waves, Sparkles } from 'lucide-react';
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

  const isOxygenRelated = parameter === 'DO' || parameter === 'BOD';
  const isRedAlert = status === 'CRITICAL';
  const isWarning = status === 'WARNING';

  const statusColor = isRedAlert 
    ? 'text-rose-700 bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-sm animate-pulse' 
    : isWarning 
    ? 'text-amber-800 bg-amber-50 border-amber-300' 
    : 'text-emerald-700 bg-emerald-50 border-emerald-300';

  const valueColor = isRedAlert 
    ? 'text-rose-600' 
    : isWarning 
    ? 'text-amber-700' 
    : 'text-slate-900';

  const TrendIcon = trend === 'UP' ? ArrowUpRight : trend === 'DOWN' ? ArrowDownRight : Minus;
  
  return (
    <button 
      onClick={() => setSelectedParameter(parameter)}
      className={`w-full text-left relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 group ${
        isSelected 
          ? `bg-white shadow-xl ring-2 scale-[1.02]` 
          : 'bg-white hover:bg-slate-50/90 border-slate-200/90 shadow-sm hover:shadow-md hover:scale-[1.01]'
      }`}
      style={{
        borderColor: isSelected ? meta.accentHex : undefined,
        boxShadow: isSelected ? `0 12px 30px -5px ${meta.accentHex}30` : undefined,
        // @ts-expect-error CSS custom property for ring color
        '--tw-ring-color': `${meta.accentHex}40`,
      }}
    >
      {/* Animated Subtle Liquid Wave Background for Oxygen (DO & BOD) */}
      {isOxygenRelated && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
          <div className="absolute -bottom-8 left-0 right-0 h-24 bg-gradient-to-t from-sky-200/40 via-sky-100/20 to-transparent" />
          <svg className="absolute -bottom-2 w-[200%] h-12 animate-wave-1 fill-sky-200/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>
      )}

      {/* Top feature color accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 transition-opacity" 
        style={{ backgroundColor: meta.accentHex, opacity: isSelected ? 1 : 0.6 }} 
      />

      <div className="relative z-10 flex justify-between items-start mb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${meta.lightBg} ${meta.lightText} border ${meta.lightBorder} shadow-xs group-hover:scale-105 transition-transform`}>
            {meta.key.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
              {meta.displayName}
              {isOxygenRelated && <Waves className="w-3 h-3 text-sky-500 animate-pulse" />}
            </h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-mono font-medium">
              {isStationSpecific ? 'Station Value' : 'Corridor Avg'}
            </p>
          </div>
        </div>

        {/* Live Alert Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.12em] border ${statusColor}`}>
          {isRedAlert && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
          {isWarning && <AlertTriangle className="w-3 h-3 text-amber-600" />}
          <span suppressHydrationWarning>{isRedAlert ? 'RED ALERT' : isWarning ? 'WARNING' : 'SAFE'}</span>
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-2 mb-4">
        <span suppressHydrationWarning className={`text-3xl font-mono font-bold ${valueColor}`}>
          {formatValue(value, meta.decimals)}
        </span>
        <span className="text-sm text-slate-500 font-semibold">{meta.unit}</span>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <TrendIcon className="w-4 h-4" style={{ color: meta.accentHex }} />
          <span className="capitalize text-[10px] tracking-wider font-semibold">{trend.toLowerCase()} trend</span>
        </div>
        <div className="text-slate-400 font-mono text-[10px] font-medium">{formatTimeAgo(lastUpdated)}</div>
      </div>
    </button>
  );
}
