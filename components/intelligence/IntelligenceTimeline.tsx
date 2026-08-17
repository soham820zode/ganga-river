'use client';

import React from 'react';
import { Insight } from '../../types/insight';
import { Clock, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface IntelligenceTimelineProps {
  insights: Insight[];
}

export function IntelligenceTimeline({ insights }: IntelligenceTimelineProps) {
  const sortedInsights = [...insights].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getIcon = (type: Insight['type'], severity: Insight['severity']) => {
    if (type === 'RECOVERY') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (severity === 'CRITICAL') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (severity === 'WARNING') return <AlertCircle className="w-4 h-4 text-orange-500" />;
    if (type === 'TREND_CHANGE') return <TrendingUp className="w-4 h-4 text-blue-400" />;
    return <Info className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6">
      <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Intelligence Timeline
      </h3>
      
      <div className="space-y-6">
        {sortedInsights.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent intelligence events.</p>
        ) : (
          <div className="relative border-l border-slate-800 ml-3 space-y-6">
            {sortedInsights.slice(0, 10).map((insight) => (
              <div key={insight.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 bg-slate-900 rounded-full p-0.5 border border-slate-800">
                  {getIcon(insight.type, insight.severity)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      {insight.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {insight.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono tracking-wider uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {insight.source}
                    </span>
                    {insight.parameter && (
                      <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">
                        {insight.parameter}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
