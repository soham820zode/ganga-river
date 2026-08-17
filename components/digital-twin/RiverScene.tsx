"use client";
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { RiverPath } from './RiverPath';
import { RiverParticles } from './RiverParticles';
import { StationNodes } from './StationNodes';
import { useJalPulseStore } from '../../store/useJalPulseStore';

export function RiverScene() {
  const controlsRef = useRef<CameraControls>(null);
  const cameraTarget = useJalPulseStore(state => state.cameraTarget);
  const autoRotate = useJalPulseStore(state => state.autoRotate);

  // Initial camera setup
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        0, 5, 8, // Position
        0, 0, 0, // Target
        false    // animated
      );
    }
  }, []);

  // Handle camera targeting when a station is selected
  useEffect(() => {
    if (controlsRef.current && cameraTarget) {
      controlsRef.current.setLookAt(
        cameraTarget[0] + 2, cameraTarget[1] + 3, cameraTarget[2] + 4, // Offset position
        cameraTarget[0], cameraTarget[1], cameraTarget[2], // Target
        true // animated
      );
    }
  }, [cameraTarget]);
  
  // Handle auto-rotation
  useFrame((_, delta) => {
    if (autoRotate && controlsRef.current && !cameraTarget) {
      controlsRef.current.azimuthAngle -= 0.1 * delta;
    }
  });

  return (
    <>
      <color attach="background" args={['#f8fafc']} />
      <fog attach="fog" args={['#f8fafc', 8, 26]} />
      
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 12, 5]} intensity={1.2} color="#0284c7" />
      <pointLight position={[-5, 8, -5]} intensity={0.6} color="#059669" />

      <RiverPath />
      <RiverParticles />
      <StationNodes />
      
      {/* Subtle floor grid for geographic context */}
      <gridHelper args={[30, 30, '#cbd5e1', '#e2e8f0']} position={[0, -3, 0]} />

      <CameraControls 
        ref={controlsRef}
        minDistance={2}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 + 0.1} // Prevent going too far below the river
        makeDefault
      />
    </>
  );
}
