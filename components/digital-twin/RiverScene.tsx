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
      <color attach="background" args={['#05080D']} />
      <fog attach="fog" args={['#05080D', 5, 20]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#00e5ff" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#10b981" />

      <RiverPath />
      <RiverParticles />
      <StationNodes />
      
      {/* Subtle floor grid for geographic context */}
      <gridHelper args={[30, 30, '#0e1722', '#0e1722']} position={[0, -3, 0]} />

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
