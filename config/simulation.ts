import { ParameterConfig } from '../types/simulation';

export const simulationConfig = {
  updateIntervalMs: 5000,
  historyDurationHours: 72,
  historicalStepMinutes: 15,
  anomalyEnabled: true,
  anomalyProbability: 0.01,
  defaultScenario: 'NORMAL' as const,
  deterministicDemoMode: true
};

export const parameterConfigs: Record<string, ParameterConfig> = {
  pH: { unit: 'pH', minClamp: 0, maxClamp: 14, noiseScale: 0.05, trendStrength: 0.01, periodicStrength: 0.1 },
  DO: { unit: 'mg/L', minClamp: 0, maxClamp: 15, noiseScale: 0.1, trendStrength: 0.02, periodicStrength: 0.2 },
  BOD: { unit: 'mg/L', minClamp: 0, maxClamp: 100, noiseScale: 0.2, trendStrength: 0.05, periodicStrength: 0.1 },
  Temperature: { unit: '°C', minClamp: 0, maxClamp: 40, noiseScale: 0.1, trendStrength: 0.02, periodicStrength: 1.5 },
  Turbidity: { unit: 'NTU', minClamp: 0, maxClamp: 500, noiseScale: 1.0, trendStrength: 0.1, periodicStrength: 0.5 }
};
