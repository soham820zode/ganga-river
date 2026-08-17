"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MockStation } from '../../config/stations';
import { Button } from '../ui/Button';
import { X, Activity } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { useJalPulseStore } from '../../store/useJalPulseStore';

interface StationPreviewProps {
  station: MockStation;
  onClose: () => void;
}

export function StationPreview({ station, onClose }: StationPreviewProps) {
  const router = useRouter();
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);

  const handleOpenStation = () => {
    setSelectedStation(station.id);
    router.push('/monitoring');
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <button 
        onClick={onClose}
        className="absolute -top-2 -right-2 p-1 text-slate-400 hover:text-slate-700 transition-colors bg-white rounded-full border border-slate-200 shadow-sm"
      >
        <X className="w-4 h-4" />
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
          <StatusBadge status={station.status} />
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono font-medium">
          {station.id} &middot; {station.region}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2 block">
          AVAILABLE PARAMETERS
        </span>
        <div className="flex flex-wrap gap-1.5">
          {station.availableParameters.map(param => (
            <span key={param} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-800 font-mono font-bold shadow-xs">
              {param}
            </span>
          ))}
        </div>
      </div>

      <Button 
        variant="primary" 
        onClick={handleOpenStation}
        className="w-full flex items-center justify-center gap-2"
      >
        <Activity className="w-4 h-4" />
        OPEN STATION MONITOR
      </Button>
    </div>
  );
}
