"use client";
import React from 'react';
import { Navbar } from '../../components/navigation/Navbar';
import { DashboardHeader } from '../../components/monitoring/DashboardHeader';
import { SystemOverview } from '../../components/monitoring/SystemOverview';
import { ParameterCard } from '../../components/monitoring/ParameterCard';
import { StationTable } from '../../components/monitoring/StationTable';
import { DemoControls } from '../../components/monitoring/DemoControls';
import { ParameterDetailModal } from '../../components/monitoring/ParameterDetailModal';
import { RiverMap } from '../../components/map/RiverMap';
import { StationExplorer } from '../../components/stations/StationExplorer';
import { useSimulation } from '../../hooks/useSimulation';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { ParameterType } from '../../types/water-quality';

import { TopIntelligenceBanner } from '../../components/intelligence/TopIntelligenceBanner';

export default function MonitoringDashboard() {
  const { snapshot } = useSimulation();
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  
  const parameters: ParameterType[] = ['pH', 'DO', 'BOD', 'Temperature', 'Turbidity'];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      <TopIntelligenceBanner />
      <DashboardHeader />
      <SystemOverview />

      {/* Parameter Cards Row */}
      <div className="px-4 md:px-8 py-6 w-full">
        <h3 className="text-[10px] font-bold tracking-[0.3em] text-accent mb-5 uppercase text-glow">Current Water Quality</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {parameters.map(p => {
            // Determine if we show network avg or selected station
            let value = 0;
            let status = 'NORMAL' as import('../../types/water-quality').WaterQualityStatus;
            let trend = 'STABLE' as import('../../types/water-quality').TrendDirection;
            let time = snapshot.lastUpdateMs.toString();
            let isStation = false;

            if (selectedStationId && snapshot.stations[selectedStationId]?.readings[p]) {
              const reading = snapshot.stations[selectedStationId].readings[p]!;
              value = reading.value;
              status = reading.status;
              trend = reading.trend;
              time = reading.timestamp;
              isStation = true;
            } else {
              // Network avg mapping
              if (p==='pH') value = snapshot.networkSummary.averagePH;
              if (p==='DO') value = snapshot.networkSummary.averageDO;
              if (p==='BOD') value = snapshot.networkSummary.averageBOD;
              if (p==='Temperature') value = snapshot.networkSummary.averageTemp;
              if (p==='Turbidity') value = snapshot.networkSummary.averageTurbidity;
              // Rollup status from network warning/critical count is complex, just mock for now
              status = snapshot.networkSummary.criticalCount > 0 ? 'CRITICAL' : snapshot.networkSummary.warningCount > 0 ? 'WARNING' : 'NORMAL';
            }

            return (
              <ParameterCard 
                key={p} 
                parameter={p} 
                value={value} 
                status={status} 
                trend={trend} 
                lastUpdated={time} 
                isStationSpecific={isStation}
              />
            );
          })}
        </div>
      </div>

      {/* Map & Explorer */}
      <div className="px-4 md:px-8 py-6 w-full">
        <div className="w-full h-[600px] rounded-2xl overflow-hidden flex flex-col md:flex-row aetheris-glass shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="w-full md:w-80 lg:w-[350px] border-b md:border-b-0 md:border-r border-white/[0.06] z-10">
            <StationExplorer />
          </div>
          <div className="flex-1 relative z-0 h-[400px] md:h-full">
            <RiverMap />
          </div>
        </div>
      </div>

      <StationTable />
      <ParameterDetailModal />
      <DemoControls />
    </div>
  );
}
