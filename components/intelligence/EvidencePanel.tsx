'use client';

import React from 'react';
import { Evidence } from '../../types/insight';
import { Database, TrendingUp, TrendingDown, Minus, Clock, ShieldAlert } from 'lucide-react';

interface EvidencePanelProps {
  evidence: Evidence;
  isSimulated?: boolean;
}

export function EvidencePanel({ evidence, isSimulated = true }: EvidencePanelProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-sm shadow-xs">
      <h4 className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Database className="w-4 h-4 text-sky-600" />
        Supporting Evidence & Metrics
      </h4>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {evidence.parameter && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Parameter</span>
            <span className="text-slate-900 font-bold">{evidence.parameter}</span>
          </div>
        )}
        
        {evidence.value !== undefined && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Current Value</span>
            <span className="text-slate-900 font-mono font-bold">{evidence.value.toFixed(2)}</span>
          </div>
        )}

        {evidence.reference !== undefined && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Configured Reference</span>
            <span className="text-slate-700 font-mono font-semibold">{evidence.reference}</span>
          </div>
        )}

        {evidence.trend && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Recent Trend</span>
            <span className="flex items-center gap-1 text-slate-800 font-bold">
              {evidence.trend === 'INCREASING' && <TrendingUp className="w-3.5 h-3.5 text-rose-600" />}
              {evidence.trend === 'DECREASING' && <TrendingDown className="w-3.5 h-3.5 text-sky-600" />}
              {evidence.trend === 'STABLE' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
              {evidence.trend}
            </span>
          </div>
        )}

        {evidence.change !== undefined && evidence.change !== 0 && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Observed Change</span>
            <span className="text-slate-900 font-mono font-bold">
              {evidence.change > 0 ? '+' : ''}{evidence.change.toFixed(1)}%
            </span>
          </div>
        )}

        {evidence.historicalWindow && (
          <div>
            <span className="block text-slate-400 text-xs mb-0.5 font-medium">Time Window</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {evidence.historicalWindow}
            </span>
          </div>
        )}
        
        <div className="col-span-2 mt-2 pt-3 border-t border-slate-200">
          <span className="block text-slate-400 text-xs mb-1 font-medium">Data Source</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-800 font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-bold shadow-xs">
              {evidence.source}
            </span>
            {isSimulated && (
              <span className="flex items-center gap-1 text-amber-800 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold shadow-xs">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                SIMULATED DATA STREAM
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
