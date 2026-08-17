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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
        <p className="text-slate-500 text-sm">No significant recent changes detected in the network.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50/80">
        <h3 className="text-xs font-bold tracking-widest text-slate-700 uppercase">WHAT CHANGED?</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {changeInsights.map(insight => {
          const stationName = MOCK_STATIONS.find(s => s.id === insight.stationId)?.name || insight.stationId;
          const isIncrease = insight.evidence?.trend === 'INCREASING' || insight.summary.includes('increase');
          const isDecrease = insight.evidence?.trend === 'DECREASING' || insight.summary.includes('decrease');
          
          return (
            <div key={insight.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isIncrease ? 'bg-rose-50 text-rose-600 border border-rose-200' : isDecrease ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                  {isIncrease ? <TrendingUp className="w-5 h-5" /> : isDecrease ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{insight.parameter}</span>
                    {insight.evidence?.change && (
                      <span className={`text-xs font-bold ${isIncrease ? 'text-rose-600' : 'text-sky-600'}`}>
                        {isIncrease ? '↑' : '↓'} {Math.abs(insight.evidence.change).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {stationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {insight.evidence?.historicalWindow || 'Recent'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] uppercase font-mono tracking-wider font-bold border border-slate-200">
                      LIVE
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
