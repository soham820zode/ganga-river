"use client";
import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { MOCK_STATIONS } from '../../config/stations';
import { useJalPulseStore, StationFilterType } from '../../store/useJalPulseStore';
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
    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 whitespace-nowrap ${
      currentFilter === type 
        ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_12px_rgba(0,200,255,0.1)]' 
        : 'bg-white/[0.03] hover:bg-white/[0.06] text-text-muted border border-white/[0.06] hover:border-white/10'
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

  const filteredStations = MOCK_STATIONS.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase()) || 
                          station.region.toLowerCase().includes(stationSearch.toLowerCase());
    const matchesFilter = stationFilter === 'ALL' || station.status === stationFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedStation = MOCK_STATIONS.find(s => s.id === selectedStationId);

  return (
    <div className="w-full h-full flex flex-col bg-background/30 backdrop-blur-2xl border-l border-white/[0.06]">
      
      {/* Header & Search */}
      <div className="p-5 border-b border-white/[0.06] flex-shrink-0">
        <h2 className="text-[10px] font-bold tracking-[0.3em] text-accent mb-1 uppercase text-glow">
          Monitoring Network
        </h2>
        <p className="text-[9px] text-text-muted font-mono tracking-wider mb-4">
          DATA SOURCE: DEMO STREAM
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search stations or regions..." 
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-8 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all"
          />
          {stationSearch && (
            <button 
              onClick={() => setStationSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="ALL" label={`All (${MOCK_STATIONS.length})`} />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="NORMAL" label="Normal" />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="WARNING" label="Warning" />
          <FilterChip currentFilter={stationFilter} setStationFilter={setStationFilter} type="CRITICAL" label="Critical" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredStations.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            No stations found matching your criteria.
          </div>
        ) : (
          filteredStations.map(station => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                selectedStationId === station.id 
                  ? 'bg-accent/8 border-accent/30 shadow-[0_0_20px_rgba(0,200,255,0.1)]' 
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-semibold text-sm ${selectedStationId === station.id ? 'text-accent text-glow' : 'text-text-primary'}`}>
                    {station.name}
                  </h3>
                  <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {station.region}
                  </p>
                </div>
                <StatusBadge status={station.status} />
              </div>
              <div className="text-[9px] text-text-muted uppercase tracking-[0.15em] font-mono">
                {station.lastUpdated}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Station Preview Panel */}
      {selectedStation && (
        <div className="flex-shrink-0 p-5 border-t border-white/[0.06] bg-surface-elevated/30 backdrop-blur-2xl">
          <StationPreview station={selectedStation} onClose={() => setSelectedStation(null)} />
        </div>
      )}
    </div>
  );
}
