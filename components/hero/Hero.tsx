"use client";
import React from 'react';
import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export function Hero() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex flex-col">
      {/* Vignette overlay — the 3D canvas provides the visual background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(0,200,255,0.06)_0%,_transparent_60%)]" />
      </div>

      <HeroContent />
      <ScrollIndicator />
      
      {/* Bottom gradient blend into next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
