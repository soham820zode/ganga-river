"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { MOCK_STATIONS } from '../../config/stations';
import { MapControls } from './MapControls';

// Custom div icon mimicking the glowing pulses
const createCustomIcon = (status: string, isSelected: boolean) => {
  let color = '#00e5ff';
  if (status === 'WARNING') color = '#f59e0b';
  if (status === 'CRITICAL') color = '#ef4444';
  if (status === 'OFFLINE') color = '#64748b';

  const glowSize = isSelected ? 'w-8 h-8' : 'w-6 h-6';
  const pulseAnim = status !== 'OFFLINE' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    ? 'animate-pulse' : '';

  const html = `
    <div class="relative flex items-center justify-center ${glowSize}">
      <div class="absolute inset-0 rounded-full opacity-40 ${pulseAnim}" style="background-color: ${color}"></div>
      <div class="absolute inset-2 rounded-full border border-white/20" style="background-color: ${color}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: isSelected ? [32, 32] : [24, 24],
    iconAnchor: isSelected ? [16, 16] : [12, 12],
  });
};

// Component to handle flying to selected station
function MapController() {
  const map = useMap();
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);

  useEffect(() => {
    if (selectedStationId) {
      const station = MOCK_STATIONS.find(s => s.id === selectedStationId);
      if (station) {
        map.flyTo([station.latitude, station.longitude], 9, {
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.5
        });
      }
    }
  }, [selectedStationId, map]);

  return null;
}

export default function MapClient() {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const stationSearch = useJalPulseStore(state => state.stationSearch);
  const stationFilter = useJalPulseStore(state => state.stationFilter);

  const filteredStations = MOCK_STATIONS.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase()) || 
                          station.region.toLowerCase().includes(stationSearch.toLowerCase());
    const matchesFilter = stationFilter === 'ALL' || station.status === stationFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[27.5, 80.5]} // Center of Ganga basin
        zoom={6} 
        style={{ width: '100%', height: '100%', background: '#05080D' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Simple mock river line */}
        <GeoJSON 
          data={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [78.1642, 29.9457], // Haridwar
                [80.3319, 26.4499], // Kanpur
                [81.8463, 25.4358], // Prayagraj
                [83.0062, 25.3176], // Varanasi
                [85.1376, 25.5941]  // Patna
              ]
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any}
          style={{
            color: '#00e5ff',
            weight: 3,
            opacity: 0.6,
            lineCap: 'round',
            lineJoin: 'round',
            className: 'river-glow-path'
          }}
        />

        {filteredStations.map(station => (
          <Marker 
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createCustomIcon(station.status, selectedStationId === station.id)}
            eventHandlers={{
              click: () => {
                setSelectedStation(station.id);
              }
            }}
          />
        ))}

        <MapController />
        <MapControls />
      </MapContainer>
    </div>
  );
}
