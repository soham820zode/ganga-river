'use client';

import React from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TopIntelligenceBanner() {
  const insights = useJalPulseStore(state => state.insights);
  const topInsight = insights.length > 0 ? insights[0] : null;

  if (!topInsight) return null;

  return (
    <div className="mx-4 md:mx-8 mt-6 mb-2 bg-slate-900 border border-blue-500/30 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-blue-500/10 rounded-md">
          <Brain className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase block leading-none mb-1">
            Top Intelligence
          </span>
          <span className="text-sm font-medium text-slate-200 line-clamp-1">
            {topInsight.summary}
          </span>
        </div>
      </div>
      <Link 
        href="/intelligence" 
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-blue-500/10 rounded-md hover:bg-blue-500/20"
      >
        View Intelligence
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
