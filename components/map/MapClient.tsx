"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { MOCK_STATIONS } from '../../config/stations';
import { MapControls } from './MapControls';

// Custom div icon mimicking glowing luxury pins with feature status
const createCustomIcon = (status: string, isSelected: boolean) => {
  let color = '#0284c7';
  let ringColor = 'rgba(2, 132, 199, 0.4)';
  if (status === 'ONLINE' || status === 'NORMAL') {
    color = '#059669';
    ringColor = 'rgba(5, 150, 105, 0.35)';
  } else if (status === 'WARNING') {
    color = '#d97706';
    ringColor = 'rgba(217, 119, 6, 0.35)';
  } else if (status === 'CRITICAL') {
    color = '#e11d48';
    ringColor = 'rgba(225, 29, 72, 0.4)';
  } else if (status === 'OFFLINE') {
    color = '#64748b';
    ringColor = 'rgba(100, 116, 139, 0.2)';
  }

  const glowSize = isSelected ? 'w-9 h-9' : 'w-7 h-7';
  const pulseAnim = status !== 'OFFLINE' ? 'animate-pulse' : '';

  const html = `
    <div class="relative flex items-center justify-center ${glowSize} cursor-pointer group">
      <div class="absolute inset-0 rounded-full ${pulseAnim}" style="background-color: ${ringColor}"></div>
      <div class="absolute inset-1.5 rounded-full bg-white shadow-md border-2" style="border-color: ${color}"></div>
      <div class="w-2.5 h-2.5 rounded-full z-10" style="background-color: ${color}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: isSelected ? [36, 36] : [28, 28],
    iconAnchor: isSelected ? [18, 18] : [14, 14],
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
        style={{ width: '100%', height: '100%', background: '#f8fafc' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Crystal azure river path vector */}
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
            color: '#0284c7',
            weight: 4,
            opacity: 0.85,
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
