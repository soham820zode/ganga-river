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
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-8 bg-surface border-b border-border/50">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-text-primary uppercase">
            Historical Water Quality
          </h1>
          <p className="text-sm text-text-secondary mt-1">Explore how river-quality signals change across stations and time.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full uppercase">
            Simulated Data
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
