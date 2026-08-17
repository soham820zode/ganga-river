'use client';

import React from 'react';
import { Info, ShieldAlert, AlertTriangle, Database } from 'lucide-react';

export function MethodologyPanel() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 mt-8 shadow-sm">
      <h3 className="text-xs font-bold tracking-widest text-slate-700 uppercase mb-4 flex items-center gap-2">
        <Info className="w-4 h-4 text-sky-600" />
        Intelligence Methodology & Scientific Scope
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
        <div className="space-y-4">
          <div>
            <h4 className="text-slate-900 font-bold flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-sky-600" />
              Automated Reasoning Layer
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Environmental Intelligence layer translates continuous multi-sensor telemetry into structured, deterministic explanations. It aggregates signals, analyzes temporal trends, and cross-references against environmental benchmarks.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Correlation & Signal Bounds
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explanations reflect verified statistical variations in monitored water parameters across the Ganga river corridor, providing actionable summaries for operational response teams.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
            <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Continuous Telemetry Mode
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
              <li>Sensor data streams are actively processed in real-time.</li>
              <li>Forecast projections and alert thresholds dynamically adapt to incoming parameters.</li>
              <li>Priority scoring highlights critical stations needing immediate operator attention.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
