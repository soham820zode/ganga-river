"use client";
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MOCK_STATIONS } from '../../config/stations';
import { useJalPulseStore } from '../../store/useJalPulseStore';

export function RiverParticles() {
  const showParticles = useJalPulseStore((state) => state.showParticles);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particleCount = 200;
  
  // Reuse the same curve logic as RiverPath
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-6, 3, -3),
      new THREE.Vector3(...MOCK_STATIONS[0].position),
      new THREE.Vector3(-2.5, 1.5, -1),
      new THREE.Vector3(...MOCK_STATIONS[1].position),
      new THREE.Vector3(0, 0, 0.5),
      new THREE.Vector3(...MOCK_STATIONS[2].position),
      new THREE.Vector3(2, -0.8, 1.2),
      new THREE.Vector3(...MOCK_STATIONS[3].position),
      new THREE.Vector3(4, -1.2, 1.8),
      new THREE.Vector3(...MOCK_STATIONS[4].position),
      new THREE.Vector3(7, -2, 2.5),
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  // Initialize particle data (progress along curve and speed)
  const [particles] = React.useState(() => {
    return Array.from({ length: particleCount }).map(() => ({
      progress: Math.random(),
      speed: 0.001 + Math.random() * 0.001,
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      )
    }));
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current || !showParticles) return;
    
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    particles.forEach((p, i) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const pos = curve.getPointAt(p.progress);
      dummy.position.copy(pos).add(p.offset);
      
      const scale = 0.5 + Math.sin(p.progress * Math.PI) * 0.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!showParticles) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial 
        color="#0284c7" 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
