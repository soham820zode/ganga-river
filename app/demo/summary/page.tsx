'use client';

import React from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { demoController } from '../../../lib/demo/demoController';
import { Activity, Database, Brain, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DemoSummaryPage() {
  const { currentScenarioId } = useDemoStore();
  const scenario = demoController.getCurrentScenario();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 pt-24 font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl w-full text-center relative z-10">
        
        <div className="inline-flex items-center justify-center gap-2 mb-6 border border-slate-800 bg-slate-900/50 px-4 py-2 rounded-full">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-slate-300 tracking-widest uppercase">
            Demonstration Complete
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          FROM SIGNAL TO RESPONSE
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
          Jal Pulse connects monitoring, forecasting, intelligence and response in one environmental workflow.
        </p>

        {/* Architecture Flow */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase mb-1">Simulate</span>
              <span className="text-[10px] text-slate-500">Sensors & Data</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-700">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/30 rounded-full flex items-center justify-center mb-3">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase mb-1">Intelligence</span>
              <span className="text-[10px] text-slate-500">Detect & Analyze</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-700">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-900/20 border border-red-500/20 rounded-full flex items-center justify-center mb-3">
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase mb-1">Response</span>
              <span className="text-[10px] text-slate-500">Alert & Workflow</span>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => demoController.exitDemo()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            Explore Jal Pulse
          </button>
          {scenario && (
            <button 
              onClick={() => demoController.startDemo(scenario.id)}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
            >
              Replay Scenario
            </button>
          )}
        </div>
        
        {/* Branding Footer */}
        <div className="mt-20 flex flex-col items-center opacity-60">
          <Activity className="w-6 h-6 text-slate-500 mb-2" />
          <span className="text-lg font-bold tracking-[0.2em] text-slate-400 leading-tight">JAL PULSE</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] leading-tight font-medium mb-4">The Pulse of Ganga</span>
          <span className="text-[9px] font-mono border border-slate-700 px-2 py-0.5 rounded text-slate-500">SIMULATED PROTOTYPE</span>
        </div>

      </div>
    </div>
  );
}
