"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { useSimulation } from '../../hooks/useSimulation';
import { MOCK_STATIONS } from '../../config/stations';
import { MapControls } from './MapControls';
import { formatValue } from '../../lib/utils/formatters';

// Custom div icon with radar sonar waves, alert badges, and glowing beacons
const createCustomIcon = (
  status: string, 
  isSelected: boolean, 
  stationName: string, 
  doValue?: number,
  bodValue?: number
) => {
  const isRedAlert = status === 'CRITICAL' || (doValue !== undefined && doValue < 4.0) || (bodValue !== undefined && bodValue > 6.0);
  const isWarning = !isRedAlert && (status === 'WARNING' || (doValue !== undefined && doValue < 5.5));
  
  let primaryColor = '#059669'; // Emerald
  let ringColor = 'rgba(5, 150, 105, 0.4)';
  let tagBg = 'bg-emerald-600 text-white';
  let tagText = '🟢 SAFE';
  let pingMarkup = '';

  if (isRedAlert) {
    primaryColor = '#e11d48'; // Ruby Crimson
    ringColor = 'rgba(225, 29, 72, 0.5)';
    tagBg = 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-300 animate-pulse';
    tagText = '🔴 RED ALERT';
    pingMarkup = `
      <div class="absolute -inset-3 rounded-full animate-ping opacity-75" style="background-color: rgba(225, 29, 72, 0.45);"></div>
      <div class="absolute -inset-5 rounded-full animate-pulse opacity-40" style="background-color: rgba(225, 29, 72, 0.25);"></div>
    `;
  } else if (isWarning) {
    primaryColor = '#d97706'; // Amber
    ringColor = 'rgba(217, 119, 6, 0.4)';
    tagBg = 'bg-amber-500 text-white shadow-md';
    tagText = '🟡 MODERATE';
    pingMarkup = `
      <div class="absolute -inset-2 rounded-full animate-pulse opacity-50" style="background-color: rgba(217, 119, 6, 0.3);"></div>
    `;
  }

  const pinSize = isSelected ? 'w-8 h-8' : isRedAlert ? 'w-7 h-7' : 'w-6 h-6';

  const html = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer group pointer-events-auto" style="transform: translate(-50%, -50%);">
      
      <!-- Sonar Ping Rings -->
      ${pingMarkup}

      <!-- Glowing Halo Pin -->
      <div class="relative flex items-center justify-center ${pinSize} rounded-full transition-transform duration-200 group-hover:scale-110 shadow-xl" style="background-color: ${ringColor};">
        <div class="absolute inset-1 rounded-full bg-white shadow-md border-2" style="border-color: ${primaryColor};"></div>
        <div class="w-2.5 h-2.5 rounded-full z-10" style="background-color: ${primaryColor};"></div>
      </div>

      <!-- Floating Alert Tier Badge on Marker -->
      <div class="absolute top-8 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
        <div class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono shadow-md border border-white/40 ${tagBg}">
          ${tagText}
        </div>
        <span class="text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-md px-1.5 py-0.2 rounded border border-slate-700/80 mt-0.5 shadow-sm">
          ${stationName}
        </span>
      </div>

    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-alert-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
  const setSelectedParameter = useJalPulseStore(state => state.setSelectedParameter);
  const stationSearch = useJalPulseStore(state => state.stationSearch);
  const stationFilter = useJalPulseStore(state => state.stationFilter);
  const mapLayerType = useJalPulseStore(state => state.mapLayerType);
  const mapAlertFilter = useJalPulseStore(state => state.mapAlertFilter);
  
  const { snapshot } = useSimulation();

  const filteredStations = MOCK_STATIONS.filter(station => {
    const liveStation = snapshot.stations[station.id];
    const liveStatus = liveStation?.status || 'NORMAL';
    const doVal = liveStation?.readings['DO']?.value;
    const isRed = liveStatus === 'CRITICAL' || (doVal !== undefined && doVal < 4.0);
    const isWarn = !isRed && (liveStatus === 'WARNING' || (doVal !== undefined && doVal < 5.5));
    const isSafe = !isRed && !isWarn;

    const matchesSearch = station.name.toLowerCase().includes(stationSearch.toLowerCase()) || 
                          station.region.toLowerCase().includes(stationSearch.toLowerCase());
    
    let matchesAlertTier = true;
    if (mapAlertFilter === 'RED_ALERT') matchesAlertTier = isRed;
    else if (mapAlertFilter === 'MODERATE') matchesAlertTier = isWarn;
    else if (mapAlertFilter === 'LOW_ALERT') matchesAlertTier = isSafe;

    const matchesFilter = stationFilter === 'ALL' || station.status === stationFilter;
    
    return matchesSearch && matchesAlertTier && matchesFilter;
  });

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[26.8, 81.5]} // Center of Ganga basin corridor
        zoom={6} 
        style={{ width: '100%', height: '100%', background: mapLayerType === 'DARK' ? '#0f172a' : '#f8fafc' }}
        zoomControl={false}
      >
        {/* Layer 1: Satellite Imagery */}
        {mapLayerType === 'SATELLITE' && (
          <>
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Earthstar Geographics'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              maxZoom={18}
              opacity={0.85}
            />
          </>
        )}

        {/* Layer 2: River Vector Light */}
        {mapLayerType === 'LIGHT' && (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Layer 3: Dark Tactical */}
        {mapLayerType === 'DARK' && (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}
        
        {/* Crystal azure river path vector */}
        <GeoJSON 
          key={mapLayerType}
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
            color: mapLayerType === 'SATELLITE' ? '#38bdf8' : '#0284c7',
            weight: mapLayerType === 'SATELLITE' ? 5 : 4,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
            className: 'river-glow-path'
          }}
        />

        {/* Red Alert Heat Zones (Radius Danger Area on Map) */}
        {filteredStations.map(station => {
          const liveStation = snapshot.stations[station.id];
          const liveStatus = liveStation?.status || 'NORMAL';
          const doVal = liveStation?.readings['DO']?.value;
          const isRed = liveStatus === 'CRITICAL' || (doVal !== undefined && doVal < 4.0);

          if (!isRed) return null;

          return (
            <Circle
              key={`danger-circle-${station.id}`}
              center={[station.latitude, station.longitude]}
              radius={28000} // 28 km alert radius
              pathOptions={{
                color: '#e11d48',
                fillColor: '#e11d48',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '6, 8',
              }}
            />
          );
        })}

        {/* Station Markers with Live Alert Tiers */}
        {filteredStations.map(station => {
          const liveStation = snapshot.stations[station.id];
          const liveStatus = liveStation?.status || station.status;
          const doVal = liveStation?.readings['DO']?.value;
          const bodVal = liveStation?.readings['BOD']?.value;
          const phVal = liveStation?.readings['pH']?.value;
          const tempVal = liveStation?.readings['Temperature']?.value;
          const isRed = liveStatus === 'CRITICAL' || (doVal !== undefined && doVal < 4.0) || (bodVal !== undefined && bodVal > 6.0);
          const isWarn = !isRed && (liveStatus === 'WARNING' || (doVal !== undefined && doVal < 5.5));

          return (
            <Marker 
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createCustomIcon(liveStatus, selectedStationId === station.id, station.name, doVal, bodVal)}
              eventHandlers={{
                click: () => {
                  setSelectedStation(station.id);
                }
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-3.5 min-w-[240px] flex flex-col gap-2.5 font-sans">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{station.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{station.id} &middot; {station.region}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isRed ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      isWarn ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {isRed ? '🔴 RED ALERT' : isWarn ? '🟡 WARNING' : '🟢 SAFE'}
                    </span>
                  </div>

                  {/* Telemetry Quick Grid */}
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">DO:</span>
                      <strong className={isRed ? 'text-rose-600' : 'text-slate-800'}>{doVal ? `${formatValue(doVal, 2)} mg/L` : '—'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BOD (OB):</span>
                      <strong className={bodVal && bodVal > 4 ? 'text-rose-600' : 'text-slate-800'}>{bodVal ? `${formatValue(bodVal, 2)} mg/L` : '—'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">pH:</span>
                      <strong className="text-slate-800">{phVal ? formatValue(phVal, 2) : '—'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Temp:</span>
                      <strong className="text-slate-800">{tempVal ? `${formatValue(tempVal, 1)}°C` : '—'}</strong>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedStation(station.id);
                      setSelectedParameter('DO');
                    }}
                    className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>Inspect Oxygen & Flow</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController />
        <MapControls />
      </MapContainer>
    </div>
  );
}
