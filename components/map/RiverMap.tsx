"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingPanel } from '../ui/Loading';
import { MapLegend } from './MapLegend';

const MapClient = dynamic(() => import('./MapClient'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-background border border-border/50">
      <LoadingPanel text="Initializing spatial intelligence map..." />
    </div>
  )
});

export function RiverMap() {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      <MapClient />
      <MapLegend />
    </div>
  );
}
