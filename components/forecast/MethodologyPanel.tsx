import React from 'react';
import { Info } from 'lucide-react';

export function MethodologyPanel() {
  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-700 mb-3 uppercase flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600" /> Forecast Methodology & Scientific Basis
        </h3>
        <div className="text-sm text-slate-600 space-y-3 leading-relaxed max-w-4xl">
          <p>
            <strong className="text-slate-900">Hydrological Neural Forecast (v1.0):</strong> The system evaluates continuous telemetry streams, recent moving-average trends, and deterministic progression models to generate predictive forward projections.
          </p>
          <p>
            <strong className="text-amber-700">Predictive Modeling Architecture:</strong> Jal Pulse is designed to ingest multi-source sensor inputs and neural time-series architectures (e.g. LSTM, Transformer-based regressors) directly into this intelligence layer for proactive early intervention.
          </p>
          <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100 font-mono text-xs text-slate-500 font-medium">
            <span>Model: JalPulse_NeuralRegress_v1</span>
            <span>Corridor: Upper/Middle/Lower Ganga</span>
            <span>Confidence: 95% CI Bands</span>
          </div>
        </div>
      </div>
    </div>
  );
}
