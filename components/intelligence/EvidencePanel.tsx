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
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 text-sm">
      <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Database className="w-4 h-4" />
        Supporting Evidence
      </h4>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {evidence.parameter && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Parameter</span>
            <span className="text-slate-200 font-medium">{evidence.parameter}</span>
          </div>
        )}
        
        {evidence.value !== undefined && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Current Value</span>
            <span className="text-slate-200 font-medium">{evidence.value.toFixed(2)}</span>
          </div>
        )}

        {evidence.reference !== undefined && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Configured Reference</span>
            <span className="text-slate-200 font-medium">{evidence.reference}</span>
          </div>
        )}

        {evidence.trend && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Recent Trend</span>
            <span className="flex items-center gap-1 text-slate-200 font-medium">
              {evidence.trend === 'INCREASING' && <TrendingUp className="w-3 h-3 text-red-400" />}
              {evidence.trend === 'DECREASING' && <TrendingDown className="w-3 h-3 text-blue-400" />}
              {evidence.trend === 'STABLE' && <Minus className="w-3 h-3 text-slate-400" />}
              {evidence.trend}
            </span>
          </div>
        )}

        {evidence.change !== undefined && evidence.change !== 0 && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Observed Change</span>
            <span className="text-slate-200 font-medium">
              {evidence.change > 0 ? '+' : ''}{evidence.change.toFixed(1)}%
            </span>
          </div>
        )}

        {evidence.historicalWindow && (
          <div>
            <span className="block text-slate-500 text-xs mb-1">Time Window</span>
            <span className="flex items-center gap-1 text-slate-200 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {evidence.historicalWindow}
            </span>
          </div>
        )}
        
        <div className="col-span-2 mt-2 pt-2 border-t border-slate-700/50">
          <span className="block text-slate-500 text-xs mb-1">Data Source</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-mono text-xs bg-slate-900 px-2 py-1 rounded">
              {evidence.source}
            </span>
            {isSimulated && (
              <span className="flex items-center gap-1 text-orange-400/80 text-xs bg-orange-900/20 px-2 py-1 rounded border border-orange-500/20">
                <ShieldAlert className="w-3 h-3" />
                SIMULATED DATA
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
