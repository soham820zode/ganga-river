'use client';

import React from 'react';
import { DEMO_SCENARIOS } from '../../lib/demo/demoScenarios';
import { demoController } from '../../lib/demo/demoController';
import { Play, Activity } from 'lucide-react';

export function DemoScenarioSelector() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 shadow-sm">
              <Activity className="h-6 w-6 text-sky-600" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-[0.2em] text-slate-900 leading-tight">JAL PULSE</span>
              <span className="text-xs text-sky-600 uppercase tracking-[0.3em] leading-tight font-bold">The Pulse of Ganga</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Interactive Demonstration Mode</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Select an automated scenario to demonstrate the full capabilities of Jal Pulse, from real-time signal detection and 48-hour forecasting to response management.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_SCENARIOS.map((scenario) => (
            <div 
              key={scenario.id}
              className="bg-white border border-slate-200 hover:border-sky-400 rounded-3xl p-6 transition-all group flex flex-col cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => demoController.startDemo(scenario.id)}
            >
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                {scenario.title}
              </h3>
              <p className="text-xs text-slate-600 mb-6 flex-1 leading-relaxed">
                {scenario.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">Target Stations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.affectedStations.length > 0 ? scenario.affectedStations.map(s => (
                      <span key={s} className="text-xs font-mono bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 font-bold">
                        {s}
                      </span>
                    )) : <span className="text-xs text-slate-400 font-medium">None</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">Expected Flow</span>
                  <span className="text-xs font-bold text-slate-700">{scenario.expectedWorkflow}</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs">
                <Play className="w-4 h-4 text-sky-400" />
                Start Scenario
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-2 border border-slate-200 inline-block px-3.5 py-1 rounded-full bg-white font-bold shadow-xs">
            LIVE DEMONSTRATION STREAM
          </p>
          <p className="text-xs text-slate-500">
            Automated sensor stream for evaluation and jury walkthroughs.
          </p>
        </div>
      </div>
    </div>
  );
}
