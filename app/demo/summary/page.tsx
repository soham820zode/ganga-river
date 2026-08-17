'use client';

import React from 'react';
import { useDemoStore } from '../../../store/useDemoStore';
import { demoController } from '../../../lib/demo/demoController';
import { Activity, Database, Brain, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DemoSummaryPage() {
  const { currentScenarioId } = useDemoStore();
  const scenario = demoController.getCurrentScenario();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 pt-24 font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl w-full text-center relative z-10">
        
        <div className="inline-flex items-center justify-center gap-2 mb-6 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">
            Demonstration Complete
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          FROM SIGNAL TO RESPONSE
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
          Jal Pulse connects live telemetry, 48-hour neural forecasting, automated intelligence, and rapid response across the entire Ganga river network.
        </p>

        {/* Architecture Flow */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-14 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 border border-slate-200">
                <Database className="w-8 h-8 text-slate-700" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-1">Telemetry</span>
              <span className="text-[10px] text-slate-500 font-medium">Sensors & Streams</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-center mb-3">
                <Brain className="w-8 h-8 text-sky-600" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-1">Intelligence</span>
              <span className="text-[10px] text-slate-500 font-medium">Forecast & Reason</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mb-3">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-1">Response</span>
              <span className="text-[10px] text-slate-500 font-medium">Alert & Resolve</span>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => demoController.exitDemo()}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Explore Jal Pulse
          </button>
          {scenario && (
            <button 
              onClick={() => demoController.startDemo(scenario.id)}
              className="px-8 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xs"
            >
              Replay Scenario
            </button>
          )}
        </div>
        
        {/* Branding Footer */}
        <div className="mt-16 flex flex-col items-center opacity-70">
          <Activity className="w-6 h-6 text-slate-400 mb-2" />
          <span className="text-base font-bold tracking-[0.2em] text-slate-700 leading-tight">JAL PULSE</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] leading-tight font-bold mb-3">The Pulse of Ganga</span>
          <span className="text-[9px] font-mono border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-500 font-bold bg-white">MONITORING PLATFORM</span>
        </div>

      </div>
    </div>
  );
}
