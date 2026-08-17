'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { demoController } from '../../lib/demo/demoController';

const PHASES = [
  'ORIENT',
  'MONITOR',
  'ANALYZE',
  'FORECAST',
  'DETECT',
  'NOTIFY',
  'RESPOND',
  'RECOVER'
];

export function DemoTimeline() {
  const { currentScenarioId, currentStepIndex } = useDemoStore();
  const scenario = demoController.getCurrentScenario();

  if (!scenario) return null;

  const currentStep = scenario.steps[currentStepIndex];
  
  // Find which phase index we are currently in
  const currentPhaseIndex = PHASES.indexOf(currentStep?.phase || 'ORIENT');

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs relative z-50">
      
      {/* Left Branding */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          Scenario: {scenario.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider font-bold">
            LIVE STREAM
          </span>
          <span className="text-xs font-bold text-slate-800">
            DEMO MODE
          </span>
        </div>
      </div>

      {/* Center Timeline */}
      <div className="hidden lg:flex items-center gap-2 flex-1 max-w-4xl mx-8">
        {PHASES.map((phase, idx) => {
          const isActive = idx === currentPhaseIndex;
          const isPast = idx < currentPhaseIndex;
          const isFuture = idx > currentPhaseIndex;
          
          return (
            <React.Fragment key={phase}>
              <div className="flex flex-col items-center relative group">
                <div 
                  className={`w-2.5 h-2.5 rounded-full z-10 transition-colors duration-300 ${
                    isActive ? 'bg-sky-600 ring-4 ring-sky-100 shadow-sm' : 
                    isPast ? 'bg-sky-400' : 'bg-slate-200'
                  }`}
                />
                <span className={`absolute top-4 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isActive ? 'text-sky-600' :
                  isPast ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {phase}
                </span>
              </div>
              
              {/* Connector line */}
              {idx < PHASES.length - 1 && (
                <div className={`flex-1 h-[2px] transition-colors duration-300 ${
                  isPast ? 'bg-sky-300' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Progress */}
      <div className="text-right">
        <span className="text-xs font-mono font-bold text-slate-700">
          {String(currentStepIndex + 1).padStart(2, '0')} / {String(scenario.steps.length).padStart(2, '0')}
        </span>
      </div>

    </div>
  );
}
