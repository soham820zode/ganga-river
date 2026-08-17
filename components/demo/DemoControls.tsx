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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full p-2 flex items-center gap-2 shadow-2xl z-50">
      
      <button 
        onClick={() => useDemoStore.getState().setPresenterMode(!isPresenterMode)}
        className={`p-2 rounded-full transition-colors ${isPresenterMode ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        title="Toggle Presenter Mode"
      >
        <MessageSquareText className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      <button 
        onClick={() => demoController.previousStep()}
        disabled={isFirst}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        title="Previous Step"
      >
        <SkipBack className="w-5 h-5" />
      </button>

      {isPlaying ? (
        <button 
          onClick={() => demoController.pauseDemo()}
          className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-full transition-colors"
          title="Pause Demo"
        >
          <Pause className="w-5 h-5" />
        </button>
      ) : (
        <button 
          onClick={() => demoController.resumeDemo()}
          className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-full transition-colors"
          title="Auto Play (Resume)"
        >
          <Play className="w-5 h-5 ml-0.5" />
        </button>
      )}

      <button 
        onClick={() => demoController.nextStep()}
        disabled={isLast}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        title="Next Step"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      <button 
        onClick={() => demoController.startDemo(scenario.id)}
        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full"
        title="Restart Scenario"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button 
        onClick={() => demoController.exitDemo()}
        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full"
        title="Exit Demo Mode"
      >
        <X className="w-4 h-4" />
      </button>
      
    </div>
  );
}
