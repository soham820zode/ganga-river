"use client";
import React from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { ForecastFilters } from '../../components/forecast/ForecastFilters';
import { ForecastSummary } from '../../components/forecast/ForecastSummary';
import { ForecastEvents } from '../../components/forecast/ForecastEvents';
import { ForecastChart } from '../../components/forecast/ForecastChart';
import { MethodologyPanel } from '../../components/forecast/MethodologyPanel';
import { DemoControls } from '../../components/monitoring/DemoControls';

export default function ForecastPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 md:px-8 border-b border-white/[0.06] backdrop-blur-xl bg-background/30">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.1em] text-text-primary uppercase">
            Predictive Intelligence
          </h1>
          <p className="text-[10px] text-warning mt-2 font-mono tracking-[0.3em] uppercase">PROTOTYPE 48-HOUR FORECAST SYSTEM</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-warning/10 text-warning border border-warning/20 px-4 py-1.5 rounded-xl uppercase shadow-[0_0_12px_rgba(255,179,71,0.08)]">
            Simulated Forecast
          </span>
        </div>
      </div>

      <ForecastFilters />
      <ForecastSummary />
      <ForecastEvents />
      <ForecastChart />
      <MethodologyPanel />
      
      <DemoControls />
    </div>
  );
}
