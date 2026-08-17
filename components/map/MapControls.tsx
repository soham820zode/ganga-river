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
    <div className="absolute top-6 right-6 z-[400] flex flex-col gap-2 pointer-events-auto">
      <div className="overflow-hidden flex flex-col bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-md">
        <button 
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-slate-100 transition-colors border-b border-slate-100 text-slate-700 hover:text-sky-600 flex items-center justify-center"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-slate-100 transition-colors text-slate-700 hover:text-sky-600 flex items-center justify-center"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-md">
        <button 
          onClick={handleFitNetwork}
          title="Fit Network"
          className="p-2.5 hover:bg-slate-100 transition-colors text-slate-700 hover:text-sky-600 flex items-center justify-center"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
