"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { RiverScene } from './RiverScene';
import { DigitalTwinControls } from './DigitalTwinControls';
import { DigitalTwinHUD } from './DigitalTwinHUD';
import { StationList } from './StationList';
import { LoadingPanel } from '../ui/Loading';

export function DigitalTwin() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col md:flex-row bg-background overflow-hidden pt-16">
      
      {/* 3D Canvas Area */}
      <div className="relative flex-1 h-full min-h-[50vh]">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
            <LoadingPanel text="Initializing spatial environment..." />
          </div>
        }>
          <Canvas dpr={[1, 1.5]}>
            <RiverScene />
          </Canvas>
        </Suspense>
        
        <DigitalTwinHUD />
        <DigitalTwinControls />
      </div>

      {/* Accessible Station List Sidebar */}
      <div className="w-full md:w-80 h-auto md:h-full p-4 md:p-6 z-10 shrink-0 border-t md:border-t-0 md:border-l border-border/50 bg-background/50 backdrop-blur-md">
        <StationList />
      </div>
    </div>
  );
}
