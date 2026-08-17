"use client";
import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { StatusBadge } from '../ui/StatusBadge';
import { MOCK_STATIONS } from '../../config/stations';
import { useJalPulseStore } from '../../store/useJalPulseStore';

export function StationList() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const setCameraTarget = useJalPulseStore(state => state.setCameraTarget);

  return (
    <GlassPanel padding="md" className="h-full flex flex-col pointer-events-auto">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-[0.1em] text-text-primary uppercase">
          Monitoring Network
        </h3>
        <p className="text-xs text-text-muted mt-1">Select a station to focus</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {MOCK_STATIONS.map((station) => (
          <button
            key={station.id}
            onClick={() => {
              setSelectedStation(station.id);
              setCameraTarget(station.position);
            }}
            className={`w-full text-left flex items-center justify-between p-3 rounded-md transition-all ${
              selectedStationId === station.id 
                ? 'bg-accent/10 border border-accent/30 shadow-glow' 
                : 'bg-surface hover:bg-surface-elevated border border-border'
            }`}
          >
            <span className={`text-sm font-medium ${selectedStationId === station.id ? 'text-accent' : 'text-text-primary'}`}>
              {station.name}
            </span>
            <StatusBadge status={station.status as "ONLINE" | "WARNING" | "CRITICAL" | "OFFLINE"} />
          </button>
        ))}
      </div>
    </GlassPanel>
  );
}
