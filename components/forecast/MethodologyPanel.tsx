import React from 'react';
import { Info } from 'lucide-react';

export function MethodologyPanel() {
  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="bg-surface-elevated border border-border/50 rounded-xl p-6">
        <h3 className="text-sm font-bold tracking-[0.2em] text-text-secondary mb-3 uppercase flex items-center gap-2">
          <Info className="w-4 h-4" /> Forecast Methodology
        </h3>
        <div className="text-sm text-text-muted space-y-3 leading-relaxed max-w-4xl">
          <p>
            <strong className="text-text-primary">Prototype Trend Forecast (v1.0):</strong> The current system uses historical simulation data, recent moving-average trends, and a deterministic mathematical progression to generate a demonstration forecast.
          </p>
          <p>
            <strong className="text-amber-500">Important:</strong> This is a UI/workflow prototype. It is <strong>not</strong> a validated environmental prediction model. Future iterations of Jal Pulse&apos;s architecture are designed to inject authenticated ML/AI time-series models (e.g. LSTM, Prophet, XGBoost) directly into this presentation layer.
          </p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-border/20 font-mono text-xs text-text-secondary">
            <span>Model: PrototypeTrend_v1</span>
            <span>Source: Jal Pulse Demo Data</span>
            <span>Uncertainty: Variance Expansion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
