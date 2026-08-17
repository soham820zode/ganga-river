"use client";
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MockStation } from '../../config/stations';
import { useJalPulseStore } from '../../store/useJalPulseStore';

interface StationNodeProps {
  station: MockStation;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ONLINE': return '#10b981'; // success
    case 'WARNING': return '#f59e0b'; // warning
    case 'CRITICAL': return '#ef4444'; // critical
    default: return '#64748b'; // muted
  }
};

export function StationNode({ station }: StationNodeProps) {
  const selectedStationId = useJalPulseStore(state => state.selectedStationId);
  const setSelectedStation = useJalPulseStore(state => state.setSelectedStation);
  const digitalTwinMode = useJalPulseStore(state => state.digitalTwinMode);
  const showLabels = useJalPulseStore(state => state.showLabels);
  const setCameraTarget = useJalPulseStore(state => state.setCameraTarget);
  
  const isSelected = selectedStationId === station.id;
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const statusColor = getStatusColor(station.status);
  const displayColor = isSelected || hovered ? '#00e5ff' : statusColor;

  useFrame(({ clock }) => {
    if (ringRef.current) {
      if (isSelected) {
        ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 4) * 0.2);
        (ringRef.current.material as THREE.Material).opacity = 0.8;
      } else {
        ringRef.current.scale.setScalar(1);
        (ringRef.current.material as THREE.Material).opacity = 0.4;
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedStation(station.id);
    setCameraTarget(station.position);
  };

  const showLabel = showLabels && (digitalTwinMode === 'STATIONS' || digitalTwinMode === 'OVERVIEW' || isSelected || hovered);

  return (
    <group position={station.position} onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Core Node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
        <meshBasicMaterial color={displayColor} />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial 
          color={displayColor} 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vertical Connection Beam */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
        <meshBasicMaterial 
          color={displayColor} 
          transparent 
          opacity={isSelected ? 0.4 : 0.1} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* HTML Label */}
      {showLabel && (
        <Html position={[0, 1.2, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className={`flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100 opacity-80'}`}>
            <div className={`px-2 py-1 rounded bg-surface-elevated/90 backdrop-blur-md border border-border/50 shadow-lg flex items-center gap-2 ${isSelected ? 'border-accent/50 shadow-glow' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
              <span className={`text-[10px] font-bold tracking-widest whitespace-nowrap ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                {station.name.toUpperCase()}
              </span>
            </div>
            {isSelected && (
              <div className="mt-1 px-1.5 py-0.5 rounded bg-surface/80 border border-border/50">
                <span className="text-[8px] text-text-secondary uppercase">
                  {station.status} &middot; DEMO
                </span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
