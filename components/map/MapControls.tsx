"use client";
import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, Maximize, Globe, Sun, Moon, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';

export function MapControls() {
  const map = useMap();
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const mapLayerType = useJalPulseStore(state => state.mapLayerType);
  const setMapLayerType = useJalPulseStore(state => state.setMapLayerType);
  const mapAlertFilter = useJalPulseStore(state => state.mapAlertFilter);
  const setMapAlertFilter = useJalPulseStore(state => state.setMapAlertFilter);
  const { snapshot } = useSimulation();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleFitNetwork = () => {
    setSelectedStation(null);
    map.flyTo([27.5, 80.5], 6, {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.5
    });
  };

  // Count alert levels from live simulation
  const stations = Object.values(snapshot.stations);
  const redAlertCount = stations.filter(s => s.status === 'CRITICAL' || (s.readings['DO'] && s.readings['DO'].value < 4.0)).length;
  const warningCount = stations.filter(s => s.status === 'WARNING' && !(s.readings['DO'] && s.readings['DO'].value < 4.0)).length;
  const safeCount = stations.length - redAlertCount - warningCount;

  return (
    <>
      {/* Top Left: Layer Selector & Alert Tier Quick Filter HUD */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto max-w-[90vw]">
        
        {/* Layer Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-xl">
          <button
            onClick={() => setMapLayerType('SATELLITE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all ${
              mapLayerType === 'SATELLITE'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Satellite Imagery"
          >
            <Globe className="w-3.5 h-3.5 text-sky-200" />
            <span>Satellite HD</span>
          </button>

          <button
            onClick={() => setMapLayerType('LIGHT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all ${
              mapLayerType === 'LIGHT'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="River Vector Map"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>River Light</span>
          </button>

          <button
            onClick={() => setMapLayerType('DARK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all ${
              mapLayerType === 'DARK'
                ? 'bg-slate-800 text-sky-400 border border-sky-500/40 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Dark Bathymetry"
          >
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span>Dark Tactical</span>
          </button>
        </div>

        {/* Alert Tiers Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-lg flex-wrap">
          <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-2 py-1 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3 text-slate-500" /> Alert Level:
          </span>

          <button
            onClick={() => setMapAlertFilter('ALL')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
              mapAlertFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All ({stations.length})
          </button>

          <button
            onClick={() => setMapAlertFilter('RED_ALERT')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
              mapAlertFilter === 'RED_ALERT'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/40'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Red Alert ({redAlertCount})</span>
          </button>

          <button
            onClick={() => setMapAlertFilter('MODERATE')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
              mapAlertFilter === 'MODERATE'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Moderate ({warningCount})</span>
          </button>

          <button
            onClick={() => setMapAlertFilter('LOW_ALERT')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
              mapAlertFilter === 'LOW_ALERT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Low / Safe ({safeCount})</span>
          </button>
        </div>

      </div>

      {/* Top Right: Zoom & Navigation Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
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
            title="Fit Full River Corridor"
            className="p-2.5 hover:bg-slate-100 transition-colors text-slate-700 hover:text-sky-600 flex items-center justify-center"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
