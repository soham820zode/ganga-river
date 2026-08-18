"use client";
import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { formatValue } from '../../lib/utils/formatters';
import { 
  Wind, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Flame
} from 'lucide-react';

interface OxygenFlowVisualizerProps {
  stationId?: string | null;
  compact?: boolean;
}

export function OxygenFlowVisualizer({ stationId: propStationId, compact = false }: OxygenFlowVisualizerProps) {
  const { snapshot, injectAnomaly } = useSimulation();
  const selectedStationIdStore = useJalPulseStore(state => state.selectedStationId);
  const activeStationId = propStationId || selectedStationIdStore;

  const [aerationBoost, setAerationBoost] = useState(false);
  const [bubbleSpeed, setBubbleSpeed] = useState(1);

  // Active readings calculation
  const stationData = activeStationId ? snapshot.stations[activeStationId] : null;
  
  const doReading = stationData?.readings['DO']?.value ?? snapshot.networkSummary.averageDO;
  const bodReading = stationData?.readings['BOD']?.value ?? snapshot.networkSummary.averageBOD;
  const tempReading = stationData?.readings['Temperature']?.value ?? snapshot.networkSummary.averageTemp;

  // Saturated DO calculation at given temperature: DO_sat ≈ 14.652 - 0.41022*T + 0.007991*T^2 - 0.000077774*T^3
  const t = tempReading || 25;
  const theoreticalSat = Math.max(7.0, 14.652 - 0.41022 * t + 0.007991 * Math.pow(t, 2) - 0.000077774 * Math.pow(t, 3));
  const effectiveDO = aerationBoost ? Math.min(11.5, doReading * 1.35) : doReading;
  const saturationPct = Math.min(100, Math.max(10, Math.round((effectiveDO / theoreticalSat) * 100)));

  // Oxygen alert level
  const isCritical = effectiveDO < 4.0 || bodReading > 6.0;
  const isWarning = !isCritical && (effectiveDO < 5.5 || bodReading > 3.0);
  const isOptimal = !isCritical && !isWarning;

  // Oxygen Balance: Re-aeration vs Biochemical Demand (OB / BOD)
  const aerationRate = (0.28 * (effectiveDO < 6 ? 1.4 : 1.0) * (aerationBoost ? 2.2 : 1.0)).toFixed(2);
  const deoxygenationRate = (0.15 * (bodReading / 3.0)).toFixed(2);
  const netRate = (parseFloat(aerationRate) - parseFloat(deoxygenationRate)).toFixed(2);
  const isNetPositive = parseFloat(netRate) >= 0;

  useEffect(() => {
    if (aerationBoost) {
      const timer = setTimeout(() => setAerationBoost(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [aerationBoost]);

  const handleTriggerAeration = () => {
    setAerationBoost(true);
    setBubbleSpeed(2);
    setTimeout(() => setBubbleSpeed(1), 5000);
  };

  const handleTriggerBODSpike = () => {
    injectAnomaly('BOD_SPIKE');
  };

  // Generate dynamic bubble particles
  const bubbleCount = isCritical ? 6 : isWarning ? 12 : aerationBoost ? 28 : 20;
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => {
    const left = `${(i * (100 / bubbleCount) + (i % 3) * 5) % 94 + 3}%`;
    const size = 6 + ((i * 7) % 12);
    const duration = (2.2 + ((i * 1.3) % 2.5)) / bubbleSpeed;
    const delay = ((i * 0.4) % 3);
    const opacity = isCritical ? 0.35 : 0.75;
    return { id: i, left, size, duration, delay, opacity };
  });

  return (
    <div className={`w-full flex flex-col bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl ${compact ? 'p-4' : 'p-6 md:p-8'}`}>
      
      {/* Header with Title & Status Badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80">
              <Wind className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Oxygen Flow & Biochemical Demand Dynamics
              {aerationBoost && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sky-500 text-white shadow-sm animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> CASCADE BOOST ACTIVE
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-wider">
            {activeStationId ? `OBSERVATION NODE: ${stationData?.name || activeStationId} (${stationData?.location || 'Ganga Corridor'})` : 'GANGA CORRIDOR NETWORK-WIDE AVERAGE'}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isCritical ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 shadow-sm animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider">RED ALERT &middot; HYPOXIA RISK</span>
                <span className="text-[9px] text-rose-600/80 font-mono">DO &lt; 4.0 mg/L threshold breached</span>
              </div>
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider">MODERATE ALERT &middot; STRESS</span>
                <span className="text-[9px] text-amber-600/80 font-mono">Elevated Oxygen Demand (OB)</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider">LOW ALERT &middot; SAFE BASELINE</span>
                <span className="text-[9px] text-emerald-600/80 font-mono">Healthy Dissolved Oxygen Saturation</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Animated Stream & Meter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        
        {/* Left: River Cross-Section with Animated Liquid Wave & Rising Oxygen Bubbles */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase font-mono flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-sky-500" /> Real-Time River Water Column Flow
            </span>
            <span className="text-[10px] text-sky-600 font-mono font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              Velocity: {(1.1 * bubbleSpeed).toFixed(1)} m/s &middot; Temp: {formatValue(tempReading, 1)}°C
            </span>
          </div>

          <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden border border-sky-200/80 shadow-inner bg-gradient-to-b from-sky-100 via-sky-200/60 to-sky-400/40">
            
            {/* Ambient Water Depths Gradient */}
            <div className={`absolute inset-0 transition-colors duration-1000 ${
              isCritical ? 'bg-gradient-to-b from-rose-900/10 via-amber-900/20 to-rose-950/40' :
              isWarning ? 'bg-gradient-to-b from-amber-500/10 via-amber-600/20 to-sky-800/30' :
              'bg-gradient-to-b from-sky-400/10 via-sky-500/25 to-blue-800/40'
            }`} />

            {/* Depth Grid Lines */}
            <div className="absolute inset-0 bg-grid-texture opacity-20 pointer-events-none" />

            {/* River Surface Animated SVG Waves */}
            <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden pointer-events-none opacity-80">
              <svg className="absolute w-[200%] h-full animate-wave-1 fill-sky-400/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,0 L0,0 Z" />
              </svg>
              <svg className="absolute w-[200%] h-full animate-wave-2 fill-sky-300/40" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0 C200,70 400,-30 600,50 C800,110 1000,-10 1200,30 L1200,0 L0,0 Z" />
              </svg>
            </div>

            {/* Rising Animated Oxygen Micro-Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {bubbles.map(b => (
                <div
                  key={b.id}
                  className="absolute bottom-0 rounded-full animate-bubble"
                  style={{
                    left: b.left,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    animationDuration: `${b.duration}s`,
                    animationDelay: `${b.delay}s`,
                    background: isCritical 
                      ? 'radial-gradient(circle, rgba(251,113,133,0.9) 0%, rgba(225,29,72,0.3) 100%)' 
                      : aerationBoost 
                      ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(56,189,248,0.9) 60%, rgba(2,132,199,0.4) 100%)'
                      : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(56,189,248,0.7) 70%, rgba(3,105,161,0.2) 100%)',
                    boxShadow: isCritical 
                      ? '0 0 8px rgba(225,29,72,0.6)' 
                      : '0 0 10px rgba(56,189,248,0.8)',
                    opacity: b.opacity,
                  }}
                >
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5 opacity-80" />
                </div>
              ))}
            </div>

            {/* Center Flow Stream Information HUD */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-500">Dissolved Oxygen (DO)</span>
                  <span className={`text-2xl font-mono font-bold ${
                    isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-sky-700'
                  }`}>
                    {formatValue(effectiveDO, 2)} <span className="text-xs text-slate-500 font-medium">mg/L</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-500">Oxygen Demand (BOD / OB)</span>
                  <span className={`text-2xl font-mono font-bold ${
                    bodReading > 5 ? 'text-rose-600' : bodReading > 3 ? 'text-amber-600' : 'text-emerald-700'
                  }`}>
                    {formatValue(bodReading, 2)} <span className="text-xs text-slate-500 font-medium">mg/L</span>
                  </span>
                </div>
              </div>

              {/* Dynamic Trend */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                {isNetPositive ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Net Aeration (+{netRate}/d)</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-700">Net Deficit ({netRate}/d)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Liquid Saturation Gauge & Metabolic Balance */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Radial Liquid Saturation Meter */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono block">
                DO Saturation Index
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-mono font-bold text-slate-900">{saturationPct}%</span>
                <span className="text-xs text-slate-500 font-medium">of {theoreticalSat.toFixed(1)} mg/L max</span>
              </div>
              <p className="text-[10px] text-slate-500">
                {saturationPct >= 80 ? 'Optimal oxygen concentration for aquatic fauna.' :
                 saturationPct >= 50 ? 'Sub-optimal stress level; elevated microbial demand.' :
                 'Critical hypoxia; immediate aeration required.'}
              </p>
            </div>

            {/* Circular Gauge Graphic with Wave */}
            <div className="relative w-20 h-20 rounded-full border-4 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner flex-shrink-0">
              <div 
                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
                  isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ height: `${saturationPct}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 animate-shimmer" />
              </div>
              <span className="relative z-10 font-mono font-bold text-xs text-slate-900 bg-white/80 px-1.5 py-0.5 rounded-md shadow-xs">
                {saturationPct}%
              </span>
            </div>
          </div>

          {/* DO vs BOD ("OB") Oxygen Balance Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">
                Aeration vs Demand Balance (OB)
              </span>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                isNetPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {isNetPositive ? 'O2 REPLENISHMENT' : 'O2 DEPLETION'}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-600 font-mono mb-1">
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-sky-500" /> Re-Aeration Rate</span>
                  <span className="font-bold text-sky-700">+{aerationRate} mg/L/d</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, parseFloat(aerationRate) * 120)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-600 font-mono mb-1">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-rose-500" /> BOD ("OB") Demand</span>
                  <span className="font-bold text-rose-700">-{deoxygenationRate} mg/L/d</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, parseFloat(deoxygenationRate) * 120)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleTriggerAeration}
              disabled={aerationBoost}
              className={`p-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm ${
                aerationBoost 
                  ? 'bg-sky-500 text-white border-sky-600 animate-pulse cursor-not-allowed'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 hover:border-sky-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {aerationBoost ? 'Boosting...' : 'Simulate Cascade'}
            </button>

            <button
              onClick={handleTriggerBODSpike}
              className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              Simulate BOD Spike
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Stations Oxygen Status Quick Strip */}
      <div className="pt-4 border-t border-slate-100">
        <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase font-mono mb-3 block">
          Station Network Dissolved Oxygen & Alert Tiers
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {Object.values(snapshot.stations).map(st => {
            const stDO = st.readings['DO']?.value || 0;
            const stBOD = st.readings['BOD']?.value || 0;
            const stStatus = st.status;
            const isStRedAlert = stStatus === 'CRITICAL' || stDO < 4.0;
            const isStWarning = !isStRedAlert && (stStatus === 'WARNING' || stDO < 5.5);

            return (
              <div 
                key={st.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isStRedAlert ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-400/30' :
                  isStWarning ? 'bg-amber-50/80 border-amber-300' :
                  'bg-slate-50 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800 truncate">{st.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    isStRedAlert ? 'bg-rose-500 animate-ping' :
                    isStWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500">DO: <strong className={isStRedAlert ? 'text-rose-600' : 'text-slate-800'}>{stDO.toFixed(1)}</strong></span>
                  <span className="text-slate-500">OB: <strong className={stBOD > 4 ? 'text-rose-600' : 'text-slate-800'}>{stBOD.toFixed(1)}</strong></span>
                </div>
                <div className="mt-1">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                    isStRedAlert ? 'bg-rose-200/80 text-rose-800' :
                    isStWarning ? 'bg-amber-200/80 text-amber-800' :
                    'bg-emerald-200/80 text-emerald-800'
                  }`}>
                    {isStRedAlert ? '🔴 RED ALERT' : isStWarning ? '🟡 MODERATE' : '🟢 LOW ALERT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
