'use client';

import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { demoController } from '../../lib/demo/demoController';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, X, MessageSquareText } from 'lucide-react';

export function DemoControls() {
  const { isPlaying, currentStepIndex, isPresenterMode } = useDemoStore();
  const scenario = demoController.getCurrentScenario();

  if (!scenario) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === scenario.steps.length - 1;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full p-2 flex items-center gap-2 shadow-2xl z-50">
      
      <button 
        onClick={() => useDemoStore.getState().setPresenterMode(!isPresenterMode)}
        className={`p-2 rounded-full transition-colors ${isPresenterMode ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
        title="Toggle Presenter Mode"
      >
        <MessageSquareText className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button 
        onClick={() => demoController.previousStep()}
        disabled={isFirst}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        title="Previous Step"
      >
        <SkipBack className="w-5 h-5" />
      </button>

      {isPlaying ? (
        <button 
          onClick={() => demoController.pauseDemo()}
          className="p-3 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-full transition-colors border border-sky-200"
          title="Pause Demo"
        >
          <Pause className="w-5 h-5" />
        </button>
      ) : (
        <button 
          onClick={() => demoController.resumeDemo()}
          className="p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-full transition-colors shadow-sm"
          title="Auto Play (Resume)"
        >
          <Play className="w-5 h-5 ml-0.5" />
        </button>
      )}

      <button 
        onClick={() => demoController.nextStep()}
        disabled={isLast}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        title="Next Step"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button 
        onClick={() => demoController.startDemo(scenario.id)}
        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full"
        title="Restart Scenario"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button 
        onClick={() => demoController.exitDemo()}
        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full"
        title="Exit Demo Mode"
      >
        <X className="w-4 h-4" />
      </button>
      
    </div>
  );
}
