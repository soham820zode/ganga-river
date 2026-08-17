'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { demoController } from '../../lib/demo/demoController';
import { MessageSquare, Lightbulb, Activity } from 'lucide-react';

export function DemoPresenterPanel() {
  const { isPresenterMode, currentStepIndex } = useDemoStore();
  const scenario = demoController.getCurrentScenario();

  if (!isPresenterMode || !scenario) return null;

  const currentStep = scenario.steps[currentStepIndex];
  const nextStep = scenario.steps[currentStepIndex + 1];

  return (
    <div className="fixed top-20 right-6 w-80 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-xl p-5 shadow-[0_0_30px_rgba(59,130,246,0.15)] z-50">
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase">Presenter HUD</h3>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Current Action</span>
          <p className="text-sm text-slate-300 font-medium">{currentStep.description}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-widest text-blue-400 flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3 h-3" /> Suggested Script
          </span>
          <p className="text-sm text-blue-100 italic leading-relaxed">
            &quot;{currentStep.talkingPoint}&quot;
          </p>
        </div>

        {nextStep && (
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-3 h-3" /> Up Next
            </span>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">{nextStep.title}:</strong> {nextStep.description}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
