'use client';

import React, { useState } from 'react';
import { Insight } from '../../types/insight';
import { EvidencePanel } from './EvidencePanel';
import { Info, AlertTriangle, AlertCircle, ArrowRight, Activity } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  onAction?: (action: string, context?: Insight) => void;
}

export function InsightCard({ insight, onAction }: InsightCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  const getIcon = () => {
    switch (insight.severity) {
      case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-critical" />;
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'NOTICE': return <Activity className="w-5 h-5 text-accent" />;
      default: return <Info className="w-5 h-5 text-text-muted" />;
    }
  };

  const getGlowClass = () => {
    switch (insight.severity) {
      case 'CRITICAL': return 'border-glow-red';
      case 'WARNING': return 'border-glow-amber';
      case 'NOTICE': return 'border-glow-cyan';
      default: return '';
    }
  };

  const handleAction = () => {
    if (onAction && insight.recommendation) {
      onAction(insight.recommendation.type, insight);
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-sky-300 ${
      insight.severity === 'CRITICAL' ? 'border-l-4 border-l-rose-500' :
      insight.severity === 'WARNING' ? 'border-l-4 border-l-amber-500' :
      'border-l-4 border-l-sky-500'
    }`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">
              {insight.title}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold">
            {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed mb-4">
          {insight.summary}
        </p>

        {insight.recommendation && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <span className="text-[9px] text-slate-400 block mb-0.5 tracking-[0.15em] uppercase font-mono font-bold">Recommended Action</span>
              <span className="text-xs text-slate-600 font-medium">{insight.recommendation.title}</span>
            </div>
            <button
              onClick={handleAction}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 w-full sm:w-auto shadow-xs"
            >
              Take Action
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {insight.evidence && (
          <div className="mt-3">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-[10px] text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1 tracking-[0.1em] uppercase font-bold"
            >
              {showEvidence ? 'Hide Evidence' : 'Show Evidence & Analysis'}
            </button>
            
            {showEvidence && (
              <div className="mt-3">
                <EvidencePanel evidence={insight.evidence} isSimulated={insight.isSimulated} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
