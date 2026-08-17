"use client";
import React, { useState, useEffect } from 'react';
import { Activity, Waves, Sparkles, ShieldCheck } from 'lucide-react';

export function AppIntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Calibrating Ganga River Telemetry...");
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if reduced motion is requested
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setIsVisible(false), 600);
          }, 200);
          return 100;
        }
        
        const next = prev + 5;
        if (next > 30 && next <= 65) {
          setStatusText("Initializing 48H Neural Forecast Engine...");
        } else if (next > 65 && next < 95) {
          setStatusText("Connecting 5 Corridor Monitoring Stations...");
        } else if (next >= 95) {
          setStatusText("River Intelligence Ready");
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      onClick={handleSkip}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Glowing Logo Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Ripple Rings */}
          <div className="absolute w-28 h-28 rounded-full bg-sky-500/10 animate-ping opacity-60" />
          <div className="absolute w-24 h-24 rounded-full bg-sky-500/15 animate-pulse" />
          
          <div className="relative w-20 h-20 rounded-3xl bg-white shadow-2xl border border-slate-200 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-md">
              <Waves className="w-7 h-7 text-white animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
          </div>
        </div>

        {/* Brand Name with tracking animation */}
        <div className="mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-slate-900 leading-tight">
            JAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-500">PULSE</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.35em] text-slate-400 font-mono mb-8">
          The Pulse of Ganga &middot; River Intelligence
        </p>

        {/* Progress Bar & Status */}
        <div className="w-64 max-w-full mb-4">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 font-medium h-6">
          <Activity className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{statusText}</span>
        </div>

        {/* Quick Skip hint */}
        <button 
          onClick={handleSkip}
          className="mt-8 text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors font-bold px-4 py-1.5 rounded-full border border-slate-200 bg-white/80 shadow-xs"
        >
          Enter Dashboard &rarr;
        </button>

      </div>
    </div>
  );
}
