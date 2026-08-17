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
    <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md relative z-50">
      
      {/* Left Branding */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
          Scenario: {scenario.title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
            SIMULATED
          </span>
          <span className="text-xs font-semibold text-slate-200">
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
                    isActive ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 
                    isPast ? 'bg-blue-900' : 'bg-slate-800'
                  }`}
                />
                <span className={`absolute top-4 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isActive ? 'text-blue-400' :
                  isPast ? 'text-slate-500' : 'text-slate-600'
                }`}>
                  {phase}
                </span>
              </div>
              
              {/* Connector line */}
              {idx < PHASES.length - 1 && (
                <div className={`flex-1 h-[2px] transition-colors duration-300 ${
                  isPast ? 'bg-blue-900' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Progress */}
      <div className="text-right">
        <span className="text-xs font-mono font-bold text-slate-400">
          {String(currentStepIndex + 1).padStart(2, '0')} / {String(scenario.steps.length).padStart(2, '0')}
        </span>
      </div>

    </div>
  );
}
