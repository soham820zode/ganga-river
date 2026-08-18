"use client";
import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { MOCK_STATIONS } from '../../config/stations';
import { useJalPulseStore, StationFilterType } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { StationPreview } from './StationPreview';

const FilterChip = ({ 
  type, 
  label, 
  currentFilter, 
  setStationFilter 
}: { 
  type: StationFilterType, 
  label: string, 
  currentFilter: StationFilterType, 
  setStationFilter: (f: StationFilterType) => void 
}) => (
  <button
    onClick={() => setStationFilter(type)}
    className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-[0.12em] uppercase transition-all duration-200 whitespace-nowrap ${
      currentFilter === type 
        ? 'bg-slate-900 text-white shadow-sm' 
        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200'
    }`}
  >
    {label}
  </button>
);

export function StationExplorer() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const stationSearch = useJalPulseStore(state => state.stationSearch);
  const setStationSearch = useJalPulseStore(state => state.setStationSearch);
  const stationFilter = useJalPulseStore(state => state.stationFilter);
  const setStationFilter = useJalPulseStore(state => state.setStationFilter);

  const { snapshot } = useSimulation();

  const filteredStations = MOCK_STATIONS.filter(station => {
    const liveStation = snapshot.stations[station.id];
    const liveStatus = liveStation?.status || 'NORMAL';
    const doVal = liveStation?.readings['DO']?.value;
    const isRed = liveStatus === 'CRITICAL' || (doVal !== undefined && doVal < 4.0);
    const isWarn = !isRed && (liveStatus === 'WARNING' || (doVal !== undefined && doVal < 5.5));
    const effectiveStatus = isRed ? 'CRITICAL' : isWarn ? 'WARNING' : 'NORMAL';

    const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase()) || 
                          station.region.toLowerCase().includes(stationSearch.toLowerCase());
    const matchesFilter = stationFilter === 'ALL' || effectiveStatus === stationFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedStation = MOCK_STATIONS.find(s => s.id === selectedStationId);

  return (
    <div className="w-full h-full flex flex-col bg-white/90 backdrop-blur-2xl border-l border-slate-200/80">
      
      {/* Header & Search */}
      <div className="p-5 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-[10px] font-bold tracking-[0.3em] text-sky-600 mb-1 uppercase">
          Monitoring Network
        </h2>
        <p className="text-[9px] text-slate-400 font-mono tracking-wider mb-4 font-bold">
          LIVE SATELLITE & SENSOR CORRIDOR
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stations or regions..." 
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-8 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-sm transition-all"
          />
          {stationSearch && (
            <button 
              onClick={() => setStationSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="ALL" label={`All (${MOCK_STATIONS.length})`} />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="NORMAL" label="Safe / Low" />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="WARNING" label="Moderate" />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="CRITICAL" label="Red Alert" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
        {filteredStations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No stations found matching your criteria.
          </div>
        ) : (
          filteredStations.map(station => {
            const liveStation = snapshot.stations[station.id];
            const liveStatus = liveStation?.status || 'NORMAL';
            const doVal = liveStation?.readings['DO']?.value;
            const bodVal = liveStation?.readings['BOD']?.value;
            const isRed = liveStatus === 'CRITICAL' || (doVal !== undefined && doVal < 4.0);
            const isWarn = !isRed && (liveStatus === 'WARNING' || (doVal !== undefined && doVal < 5.5));

            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selectedStationId === station.id 
                    ? 'bg-sky-50/90 border-sky-300 shadow-md ring-2 ring-sky-500/20' 
                    : isRed
                    ? 'bg-rose-50/40 hover:bg-rose-50/80 border-rose-200/90 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`font-semibold text-sm ${selectedStationId === station.id ? 'text-sky-700' : 'text-slate-900'}`}>
                      {station.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {station.region}
                    </p>
                  </div>
                  
                  {/* Real-time Alert Badge */}
                  <span className={`px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider ${
                    isRed ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' :
                    isWarn ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isRed ? '🔴 RED ALERT' : isWarn ? '🟡 WARNING' : '🟢 SAFE'}
                  </span>
                </div>

                {/* DO & BOD Quick telemetry */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100 mt-2">
                  <span>DO: <strong className={isRed ? 'text-rose-600' : 'text-slate-800'}>{doVal ? `${doVal.toFixed(1)} mg/L` : '—'}</strong></span>
                  <span>OB (BOD): <strong className={bodVal && bodVal > 4 ? 'text-rose-600' : 'text-slate-800'}>{bodVal ? `${bodVal.toFixed(1)} mg/L` : '—'}</strong></span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Station Preview Panel */}
      {selectedStation && (
        <div className="flex-shrink-0 p-5 border-t border-slate-200 bg-white/95 backdrop-blur-2xl">
          <StationPreview station={selectedStation} onClose={() => setSelectedStation(null)} />
        </div>
      )}
    </div>
  );
}
