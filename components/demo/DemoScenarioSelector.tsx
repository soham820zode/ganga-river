'use client';

import React from 'react';
import { DEMO_SCENARIOS } from '../../lib/demo/demoScenarios';
import { demoController } from '../../lib/demo/demoController';
import { Play, Activity } from 'lucide-react';

export function DemoScenarioSelector() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-[0.2em] text-slate-100 leading-tight">JAL PULSE</span>
              <span className="text-xs text-blue-400 uppercase tracking-[0.3em] leading-tight font-medium">The Pulse of Ganga</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Hackathon Demonstration Mode</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select a deterministic scenario to demonstrate the end-to-end capabilities of Jal Pulse, from signal detection to response workflow.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_SCENARIOS.map((scenario) => (
            <div 
              key={scenario.id}
              className="bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl p-6 transition-all group flex flex-col cursor-pointer"
              onClick={() => demoController.startDemo(scenario.id)}
            >
              <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">
                {scenario.title}
              </h3>
              <p className="text-sm text-slate-400 mb-6 flex-1">
                {scenario.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Target Stations</span>
                  <div className="flex flex-wrap gap-2">
                    {scenario.affectedStations.length > 0 ? scenario.affectedStations.map(s => (
                      <span key={s} className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {s}
                      </span>
                    )) : <span className="text-xs text-slate-600">None</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Expected Flow</span>
                  <span className="text-xs font-medium text-slate-300">{scenario.expectedWorkflow}</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                <Play className="w-4 h-4" />
                Start Scenario
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-2 border border-slate-800 inline-block px-3 py-1 rounded bg-slate-900">
            SIMULATED PROTOTYPE
          </p>
          <p className="text-sm text-slate-600">
            This mode uses simulated data and does not represent live operational conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
