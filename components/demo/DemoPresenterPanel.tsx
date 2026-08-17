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
    <div className="fixed top-20 right-6 w-80 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-xl z-50">
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Activity className="w-4 h-4 text-sky-600" />
        <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">Presenter HUD</h3>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1 font-bold">Current Action</span>
          <p className="text-xs text-slate-800 font-semibold leading-relaxed">{currentStep.description}</p>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3">
          <span className="text-[10px] uppercase tracking-widest text-sky-700 flex items-center gap-1.5 mb-1 font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" /> Talking Point
          </span>
          <p className="text-xs text-slate-700 italic leading-relaxed">
            &quot;{currentStep.talkingPoint}&quot;
          </p>
        </div>

        {nextStep && (
          <div className="pt-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1 font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Up Next
            </span>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-800">{nextStep.title}:</strong> {nextStep.description}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
