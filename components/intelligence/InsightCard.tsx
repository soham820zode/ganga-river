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
    <div className={`aetheris-glass rounded-2xl overflow-hidden transition-all duration-300 ${getGlowClass()}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-[9px] font-bold tracking-[0.2em] text-text-muted uppercase">
              {insight.title}
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">
            {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <p className="text-text-primary text-sm sm:text-base font-medium leading-relaxed mb-4">
          {insight.summary}
        </p>

        {insight.recommendation && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <span className="text-[9px] text-text-muted block mb-1 tracking-[0.15em] uppercase font-mono">Recommended Action</span>
              <span className="text-sm text-text-secondary">{insight.recommendation.title}</span>
            </div>
            <button
              onClick={handleAction}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 w-full sm:w-auto"
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
              className="text-[10px] text-accent hover:text-accent-hover transition-colors flex items-center gap-1 tracking-[0.1em] uppercase font-bold"
            >
              {showEvidence ? 'Hide Evidence' : 'Show Evidence'}
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
