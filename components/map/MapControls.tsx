"use client";
import React from 'react';
import { useMap } from 'react-leaflet';
import { GlassPanel } from '../ui/GlassPanel';
import { Plus, Minus, Maximize } from 'lucide-react';
import { useJalPulseStore } from '../../store/useJalPulseStore';

export function MapControls() {
  const map = useMap();
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleFitNetwork = () => {
    setSelectedStation(null);
    map.flyTo([27.5, 80.5], 6, {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.5
    });
  };

  return (
    <div className="absolute top-6 right-6 z-[400] flex flex-col gap-2">
      <GlassPanel padding="none" className="overflow-hidden flex flex-col pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="p-2 hover:bg-surface-elevated transition-colors border-b border-border/50 text-text-secondary hover:text-accent"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 hover:bg-surface-elevated transition-colors text-text-secondary hover:text-accent"
        >
          <Minus className="w-4 h-4" />
        </button>
      </GlassPanel>

      <GlassPanel padding="none" className="mt-2 pointer-events-auto">
        <button 
          onClick={handleFitNetwork}
          title="Fit Network"
          className="p-2 hover:bg-surface-elevated transition-colors text-text-secondary hover:text-accent flex items-center justify-center"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </GlassPanel>
    </div>
  );
}
