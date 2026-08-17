'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { DemoScenarioSelector } from '../../components/demo/DemoScenarioSelector';

export default function DemoPage() {
  const { isDemoActive } = useDemoStore();

  // The DemoShell in layout.tsx will handle the presentation overlay when isDemoActive is true.
  // The demoController handles routing to other pages for actual demo steps.
  // If we're on /demo and the demo is active, it's just a transition state, we probably shouldn't be here.
  // If we're on /demo and demo is NOT active, we show the scenario selector.
  
  if (isDemoActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-mono text-sm tracking-widest">
          INITIALIZING SCENARIO...
        </div>
      </div>
    );
  }

  return <DemoScenarioSelector />;
}
