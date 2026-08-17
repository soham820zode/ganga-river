"use client";
import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Activity, Layers, MapPin, Zap, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { useJalPulseStore, DigitalTwinMode } from '../../store/useJalPulseStore';

const ModeButton = ({ mode, icon, label, currentMode, setMode, setSelectedStation, setCameraTarget }: { 
  mode: DigitalTwinMode, 
  icon: React.ReactNode, 
  label: string,
  currentMode: DigitalTwinMode,
  setMode: (mode: DigitalTwinMode) => void,
  setSelectedStation: (id: string | null) => void,
  setCameraTarget: (target: [number, number, number] | null) => void
}) => (
  <Button 
    variant={currentMode === mode ? 'primary' : 'outline'} 
    size="sm" 
    onClick={() => {
      setMode(mode);
      setSelectedStation(null);
      setCameraTarget(null);
    }}
    className="flex-1 justify-center text-xs"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </div>
  </Button>
);

export function DigitalTwinControls() {
  const digitalTwinMode = useJalPulseStore(state => state.digitalTwinMode);
  const setDigitalTwinMode = useJalPulseStore(state => state.setDigitalTwinMode);
  const showLabels = useJalPulseStore(state => state.showLabels);
  const setShowLabels = useJalPulseStore(state => state.setShowLabels);
  const showParticles = useJalPulseStore(state => state.showParticles);
  const setShowParticles = useJalPulseStore(state => state.setShowParticles);
  const autoRotate = useJalPulseStore(state => state.autoRotate);
  const setAutoRotate = useJalPulseStore(state => state.setAutoRotate);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const setCameraTarget = useJalPulseStore(state => state.setCameraTarget);

  const handleReset = () => {
    setSelectedStation(null);
    setCameraTarget(null);
    setDigitalTwinMode('OVERVIEW');
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-4 pointer-events-none">
      <GlassPanel padding="md" className="pointer-events-auto shadow-2xl flex flex-col gap-4">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">
            VIEW CONTROLS
          </span>
          <div className="flex gap-2">
            <IconButton 
              icon={<Eye className={`h-4 w-4 ${showLabels ? 'text-accent' : 'text-text-muted'}`} />} 
              label="Toggle Labels" 
              size="sm" 
              variant={showLabels ? 'secondary' : 'ghost'}
              onClick={() => setShowLabels(!showLabels)}
            />
            <IconButton 
              icon={<Sparkles className={`h-4 w-4 ${showParticles ? 'text-accent' : 'text-text-muted'}`} />} 
              label="Toggle Particles" 
              size="sm" 
              variant={showParticles ? 'secondary' : 'ghost'}
              onClick={() => setShowParticles(!showParticles)}
            />
            <IconButton 
              icon={<RefreshCw className={`h-4 w-4 ${autoRotate ? 'text-accent' : 'text-text-muted'}`} />} 
              label="Toggle Auto-Rotate" 
              size="sm" 
              variant={autoRotate ? 'secondary' : 'ghost'}
              onClick={() => setAutoRotate(!autoRotate)}
            />
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              RESET
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <ModeButton currentMode={digitalTwinMode} setMode={setDigitalTwinMode} setSelectedStation={setSelectedStation} setCameraTarget={setCameraTarget} mode="OVERVIEW" icon={<Layers className="h-4 w-4" />} label="OVERVIEW" />
          <ModeButton currentMode={digitalTwinMode} setMode={setDigitalTwinMode} setSelectedStation={setSelectedStation} setCameraTarget={setCameraTarget} mode="FLOW" icon={<Activity className="h-4 w-4" />} label="FLOW" />
          <ModeButton currentMode={digitalTwinMode} setMode={setDigitalTwinMode} setSelectedStation={setSelectedStation} setCameraTarget={setCameraTarget} mode="STATIONS" icon={<MapPin className="h-4 w-4" />} label="STATIONS" />
          <ModeButton currentMode={digitalTwinMode} setMode={setDigitalTwinMode} setSelectedStation={setSelectedStation} setCameraTarget={setCameraTarget} mode="DATA" icon={<Zap className="h-4 w-4" />} label="DATA" />
        </div>
      </GlassPanel>
    </div>
  );
}
