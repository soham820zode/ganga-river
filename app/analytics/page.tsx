"use client";
import React from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters';
import { AnalyticsSummary } from '../../components/analytics/AnalyticsSummary';
import { HistoricalChart } from '../../components/analytics/HistoricalChart';
import { StationComparisonTable } from '../../components/analytics/StationComparisonTable';
import { DemoControls } from '../../components/monitoring/DemoControls';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <Navbar />
      
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            Historical Water Quality
          </h1>
          <p className="text-sm text-slate-600 mt-1">Multi-station comparative analysis, longitudinal telemetry, and corridor trends.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-xl uppercase shadow-xs">
            Live Stream
          </span>
        </div>
      </div>

      <AnalyticsFilters />
      <AnalyticsSummary />
      <HistoricalChart />
      <StationComparisonTable />
      
      <DemoControls />
    </div>
  );
}
