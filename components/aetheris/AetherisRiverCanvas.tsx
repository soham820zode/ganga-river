'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── GLSL Downstream River Shader ─── */

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uFlowSpeed;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Dual-frequency downstream displacement
    float wave1 = sin(pos.x * 2.0 + pos.y * 3.0 + uTime * uFlowSpeed * 0.8) * 0.06;
    float wave2 = cos(pos.x * 1.5 - pos.y * 2.0 + uTime * uFlowSpeed * 1.2) * 0.04;
    float wave3 = sin(pos.x * 4.0 + uTime * uFlowSpeed * 0.5) * 0.02;

    pos.z += wave1 + wave2 + wave3;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uFlowSpeed;
  uniform float uOpacity;

  // Simple noise function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // Downstream flow UV animation
    vec2 flowUv = vUv * 3.0 + vec2(0.1, 0.9) * (uTime * uFlowSpeed * 0.3);

    // Multi-layer noise for water surface
    float n1 = noise(flowUv * 4.0 + uTime * 0.2);
    float n2 = noise(flowUv * 8.0 - uTime * 0.15);
    float n3 = noise(flowUv * 16.0 + uTime * 0.1);

    float surface = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Deep river blue to shallow cyan gradient
    vec3 deepColor = vec3(0.0, 0.118, 0.22);   // #001e38
    vec3 shallowColor = vec3(0.0, 0.659, 0.91); // #00a8e8
    vec3 glowColor = vec3(0.0, 0.898, 1.0);      // #00e5ff

    // Mix based on elevation + noise
    float depthFactor = smoothstep(-0.08, 0.08, vElevation) * 0.6 + surface * 0.4;
    vec3 color = mix(deepColor, shallowColor, depthFactor);

    // Add bright caustic-like highlights
    float caustic = pow(surface, 3.0) * 1.5;
    color += glowColor * caustic * 0.3;

    // Subtle edge vignette
    float vignette = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x);
    vignette *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

    float alpha = (0.35 + surface * 0.15) * vignette * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─── River Plane Mesh ─── */

function RiverPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollSpeed = useRef(1.0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlowSpeed: { value: 1.0 },
      uOpacity: { value: 1.0 },
    }),
    []
  );

  // Scroll-driven flow speed
  useEffect(() => {
    let lastScroll = 0;
    let velocity = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      velocity = Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;
      // Map scroll velocity to flow speed boost (1.0 base → up to 3.0)
      scrollSpeed.current = 1.0 + Math.min(velocity * 0.02, 2.0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((_, delta) => {
    // Decay scroll speed back to base
    scrollSpeed.current += (1.0 - scrollSpeed.current) * delta * 2.0;
    uniforms.uFlowSpeed.value = scrollSpeed.current;
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0.1]} position={[0, -0.5, 0]}>
      <planeGeometry args={[12, 12, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Ambient Particles ─── */

function AmbientParticles() {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      // Slow drift downstream (positive Y is "down-river")
      posAttr.array[i * 3] += Math.sin(t * 0.1 + i) * 0.001;
      posAttr.array[i * 3 + 1] -= 0.003;
      posAttr.array[i * 3 + 2] += Math.cos(t * 0.15 + i) * 0.0005;

      // Reset particles that drift too far
      if (posAttr.array[i * 3 + 1] < -4) {
        posAttr.array[i * 3 + 1] = 4;
        posAttr.array[i * 3] = (Math.random() - 0.5) * 14;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00a8e8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Camera Controller ─── */

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    // Gentle breathing camera motion
    const t = Date.now() * 0.0001;
    camera.position.x = Math.sin(t) * 0.3;
    camera.position.y = 3 + Math.sin(t * 1.5) * 0.1;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Main Export ─── */

export function AetherisRiverCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ isolation: 'isolate' }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <CameraController />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#00a8e8" />
        <RiverPlane />
        <AmbientParticles />
      </Canvas>

      {/* Gradient overlays for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />
    </div>
  );
}
