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
        className="absolute -top-2 -right-2 p-1 text-text-muted hover:text-text-primary transition-colors bg-background rounded-full border border-border"
      >
        <X className="w-4 h-4" />
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-text-primary">{station.name}</h3>
          <StatusBadge status={station.status} />
        </div>
        <p className="text-xs text-text-muted uppercase tracking-widest font-mono">
          {station.id} &middot; {station.region}
        </p>
      </div>

      <div className="bg-background/80 rounded-md p-3 border border-border/50">
        <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-2 block">
          AVAILABLE PARAMETERS
        </span>
        <div className="flex flex-wrap gap-2">
          {station.availableParameters.map(param => (
            <span key={param} className="px-2 py-1 bg-surface border border-border rounded text-[10px] text-text-primary font-mono uppercase">
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
