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
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center py-6 px-4 md:px-8 border-b border-slate-200/80 backdrop-blur-xl bg-white/70">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            Predictive Intelligence
          </h1>
          <p className="text-[10px] text-amber-700 mt-1 font-mono tracking-[0.2em] uppercase font-bold">48-HOUR HYDROLOGICAL NEURAL FORECAST SYSTEM</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-xl uppercase shadow-xs">
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
