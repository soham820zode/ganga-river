"use client";
import React from 'react';
import { Hero } from '../components/hero/Hero';
import { Navbar } from '../components/navigation/Navbar';
import { DigitalTwin } from '../components/digital-twin/DigitalTwin';
import { RiverMap } from '../components/map/RiverMap';
import { StationExplorer } from '../components/stations/StationExplorer';
import { OxygenFlowVisualizer } from '../components/water-quality/OxygenFlowVisualizer';
import { ParameterDetailModal } from '../components/monitoring/ParameterDetailModal';
import { DemoControls } from '../components/monitoring/DemoControls';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      
      <section id="digital-twin" className="relative w-full">
        <DigitalTwin />
      </section>

      {/* Oxygen Flow & Stream Aeration Section */}
      <section id="oxygen-flow" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-sky-600 mb-2 uppercase">
            Biochemical Telemetry
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            RIVER OXYGEN DYNAMICS & BIOCHEMICAL DEMAND
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-2">
            Real-time simulated dissolved oxygen saturation, rising aeration bubbles, and biochemical oxygen demand across the Ganga corridor.
          </p>
        </div>

        <OxygenFlowVisualizer />
      </section>

      {/* Interactive Satellite & Vector Map Section */}
      <section id="river-map" className="relative w-full min-h-screen flex flex-col border-t border-slate-200/80">
        
        {/* Section Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-sky-600 mb-3 uppercase">
            Spatial Alert Intelligence
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            SATELLITE & CORRIDOR ALERT NETWORK
          </h3>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            High-resolution satellite imagery overlay showing real-time <span className="text-rose-600 font-bold font-mono">RED ALERT</span> risk zones and <span className="text-emerald-600 font-bold font-mono">SAFE BASELINES</span> across Ganga stations.
          </p>
        </div>

        {/* Map Layout */}
        <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto border border-slate-200/80 overflow-hidden h-[800px] max-h-[85vh] rounded-3xl mx-4 md:mx-8 aetheris-glass shadow-2xl">
          <div className="w-full md:w-80 lg:w-[400px] flex-shrink-0 h-[400px] md:h-full z-10">
            <StationExplorer />
          </div>
          <div className="flex-1 h-[400px] md:h-full relative z-0">
            <RiverMap />
          </div>
        </div>
        
        <div className="h-20" />
      </section>

      <ParameterDetailModal />
      <DemoControls />
    </main>
  );
}
