"use client";
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MOCK_STATIONS } from '../../config/stations';

export function RiverPath() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Generate a smooth spline based on station positions
  const curve = useMemo(() => {
    // Add some intermediate points to make the river meander
    const points = [
      new THREE.Vector3(-6, 3, -3), // Start before Haridwar
      new THREE.Vector3(...MOCK_STATIONS[0].position),
      new THREE.Vector3(-2.5, 1.5, -1),
      new THREE.Vector3(...MOCK_STATIONS[1].position),
      new THREE.Vector3(0, 0, 0.5),
      new THREE.Vector3(...MOCK_STATIONS[2].position),
      new THREE.Vector3(2, -0.8, 1.2),
      new THREE.Vector3(...MOCK_STATIONS[3].position),
      new THREE.Vector3(4, -1.2, 1.8),
      new THREE.Vector3(...MOCK_STATIONS[4].position),
      new THREE.Vector3(7, -2, 2.5), // End past Patna
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  const elapsedTime = useRef(0);

  // Subtle pulsing animation on the river material
  useFrame((_, delta) => {
    if (materialRef.current) {
      elapsedTime.current += delta;
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(elapsedTime.current * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 100, 0.15, 8, false]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#0284c7" 
          emissive="#0369a1"
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
      {/* Outer glow tube */}
      <mesh>
        <tubeGeometry args={[curve, 100, 0.28, 8, false]} />
        <meshBasicMaterial 
          color="#38bdf8"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
