"use client";
import React from 'react';

export function HeroVisual() {
  // The global AetherisRiverCanvas now handles all background visuals.
  // This component serves as a transparent overlay with atmospheric gradient only.
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/3 via-background to-background" />
    </div>
  );
}
