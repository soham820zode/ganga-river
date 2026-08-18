"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MockStation } from '../../config/stations';
import { Button } from '../ui/Button';
import { X, Activity, Wind, AlertTriangle } from 'lucide-react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { formatValue } from '../../lib/utils/formatters';

interface StationPreviewProps {
  station: MockStation;
  onClose: () => void;
}

export function StationPreview({ station, onClose }: StationPreviewProps) {
  const router = useRouter();
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const { snapshot } = useSimulation();

  const liveStation = snapshot.stations[station.id];
  const liveStatus = liveStation?.status || station.status;
  const doReading = liveStation?.readings['DO']?.value;
  const bodReading = liveStation?.readings['BOD']?.value;

  const isRedAlert = liveStatus === 'CRITICAL' || (doReading !== undefined && doReading < 4.0);
  const isWarning = !isRedAlert && (liveStatus === 'WARNING' || (doReading !== undefined && doReading < 5.5));

  const handleOpenStation = () => {
    setSelectedStation(station.id);
    router.push('/monitoring');
  };

  const handleOpenOxygen = () => {
    setSelectedStation(station.id);
    setSelectedParameter('DO');
    router.push('/monitoring');
  };

  return (
    <div className="flex flex-col gap-3.5 relative">
      <button 
        onClick={onClose}
        className="absolute -top-2 -right-2 p-1.5 text-slate-400 hover:text-slate-700 transition-colors bg-white rounded-full border border-slate-200 shadow-sm"
      >
        <X className="w-4 h-4" />
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            isRedAlert ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' :
            isWarning ? 'bg-amber-100 text-amber-800 border border-amber-300' :
            'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            {isRedAlert ? '🔴 RED ALERT' : isWarning ? '🟡 MODERATE' : '🟢 SAFE'}
          </span>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">
          {station.id} &middot; {station.region}
        </p>
      </div>

      {/* Live Oxygen Metrics Bar */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">Dissolved O2 (DO)</span>
          <span className={`text-base font-bold ${isRedAlert ? 'text-rose-600' : 'text-slate-900'}`}>
            {doReading !== undefined ? `${formatValue(doReading, 2)} mg/L` : '—'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">Oxygen Demand (OB)</span>
          <span className={`text-base font-bold ${bodReading && bodReading > 4 ? 'text-rose-600' : 'text-slate-900'}`}>
            {bodReading !== undefined ? `${formatValue(bodReading, 2)} mg/L` : '—'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleOpenOxygen}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <Wind className="w-4 h-4 text-sky-600 animate-pulse" />
          Inspect Oxygen Flow
        </button>

        <Button 
          variant="primary" 
          onClick={handleOpenStation}
          className="w-full flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          OPEN FULL MONITOR
        </Button>
      </div>
    </div>
  );
}
