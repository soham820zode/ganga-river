"use client";
import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { HeroStatus } from './HeroStatus';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Radio } from 'lucide-react';

export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set('.hero-eyebrow, .hero-title-line, .hero-desc, .hero-cta, .hero-status', { 
        opacity: 1, 
        y: 0, 
        clipPath: 'inset(0% 0% 0% 0%)' 
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial state
    gsap.set('.hero-eyebrow, .hero-desc, .hero-cta, .hero-status', { opacity: 0, y: 20 });
    gsap.set('.hero-title-line', { clipPath: 'inset(100% 0% 0% 0%)', y: 20 });
    
    // Animation sequence
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
      .to('.hero-title-line', { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.2, stagger: 0.15 }, "-=0.6")
      .to('.hero-desc', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
      .to('.hero-status', { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
  }, { scope: containerRef });

  const handleScrollToMonitoring = () => {
    const target = document.getElementById('river-intelligence');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl">
        {/* Eyebrow badge */}
        <div className="hero-eyebrow inline-flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-accent px-4 py-2 aetheris-glass rounded-full">
            <Radio className="w-3 h-3 text-green-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
          <span className="text-[10px] font-bold tracking-[0.3em] text-text-muted px-4 py-2 aetheris-glass rounded-full">
            SIH1694
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-text-primary leading-[1.05] mb-4">
          <div className="hero-title-line overflow-hidden pb-2">
            <span className="text-glow">AETHERIS</span>
          </div>
          <div className="hero-title-line overflow-hidden pb-2">
            WATER <span className="text-accent text-glow-strong">MATRIX</span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="hero-desc text-[11px] tracking-[0.3em] uppercase text-text-muted font-mono mb-6">
          Real-Time Ganga River Water Quality Forecasting System
        </p>
        
        {/* Description */}
        <p className="hero-desc text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
          Environmental intelligence platform for monitoring, forecasting, and understanding the changing pulse of the Ganga river system.
        </p>
        
        {/* CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="primary" size="lg" onClick={handleScrollToMonitoring}>
            EXPLORE LIVE DATA
          </Button>
          <Button variant="outline" size="lg">
            VIEW METHODOLOGY
          </Button>
        </div>
        
        {/* Status bar */}
        <div className="hero-status mt-10">
          <HeroStatus />
        </div>
      </div>
    </div>
  );
}
