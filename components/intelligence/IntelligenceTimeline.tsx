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
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 shadow-sm">
      <h3 className="text-xs font-bold tracking-widest text-slate-700 uppercase mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 text-sky-600" />
        Intelligence Timeline
      </h3>
      
      <div className="space-y-6">
        {sortedInsights.length === 0 ? (
          <p className="text-slate-400 text-sm">No recent intelligence events.</p>
        ) : (
          <div className="relative border-l border-slate-200 ml-3 space-y-6">
            {sortedInsights.slice(0, 10).map((insight) => (
              <div key={insight.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 bg-white rounded-full p-0.5 border border-slate-200 shadow-xs">
                  {getIcon(insight.type, insight.severity)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {insight.title}
                    </span>
                    <span suppressHydrationWarning className="text-xs text-slate-400 font-mono font-medium">
                      {new Date(insight.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {insight.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold border border-slate-200">
                      {insight.source}
                    </span>
                    {insight.parameter && (
                      <span className="text-[9px] font-mono tracking-wider uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md font-bold">
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
