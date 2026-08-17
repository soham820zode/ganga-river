'use client';

import React from 'react';
import { Insight } from '../../types/insight';
import { TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react';
import { MOCK_STATIONS } from '../../config/stations';

interface WhatChangedPanelProps {
  insights: Insight[];
}

export function WhatChangedPanel({ insights }: WhatChangedPanelProps) {
  // Filter for TREND_CHANGE and ANOMALY insights
  const changeInsights = insights
    .filter(i => i.type === 'TREND_CHANGE' || i.type === 'ANOMALY')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  if (changeInsights.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm">No significant recent changes detected in the simulated network.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800/80 bg-slate-800/30">
        <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">WHAT CHANGED?</h3>
      </div>
      <div className="divide-y divide-slate-800/50">
        {changeInsights.map(insight => {
          const stationName = MOCK_STATIONS.find(s => s.id === insight.stationId)?.name || insight.stationId;
          const isIncrease = insight.evidence?.trend === 'INCREASING' || insight.summary.includes('increase');
          const isDecrease = insight.evidence?.trend === 'DECREASING' || insight.summary.includes('decrease');
          
          return (
            <div key={insight.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isIncrease ? 'bg-red-500/10 text-red-400' : isDecrease ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
                  {isIncrease ? <TrendingUp className="w-5 h-5" /> : isDecrease ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-200">{insight.parameter}</span>
                    {insight.evidence?.change && (
                      <span className={`text-sm ${isIncrease ? 'text-red-400' : 'text-blue-400'}`}>
                        {isIncrease ? '↑' : '↓'} {Math.abs(insight.evidence.change).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {stationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {insight.evidence?.historicalWindow || 'Recent'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-mono tracking-wider">
                      SIMULATED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
