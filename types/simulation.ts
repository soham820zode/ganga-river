import { ParameterType } from './water-quality';

export interface ParameterConfig {
  unit: string;
  minClamp: number;
  maxClamp: number;
  noiseScale: number;
  trendStrength: number;
  periodicStrength: number;
}

export interface StationProfile {
  id: string;
  baselines: Record<ParameterType, number>;
  variabilityMultiplier: number; // e.g. 1.0 for Haridwar, 1.5 for Varanasi
}

export type ScenarioType = 
  | 'NORMAL' 
  | 'BOD_SPIKE' 
  | 'DO_DROP' 
  | 'TURBIDITY_SPIKE' 
  | 'MULTI_PARAMETER_EVENT';

export interface AnomalyScenario {
  type: ScenarioType;
  name: string;
  affectedStations: string[];
  affectedParameters: ParameterType[];
  magnitudeMultiplier: number;
  startTime: number; // epoch ms
  durationMs: number;
}

export interface SimulationSnapshot {
  timestamp: string;
  stations: Record<string, import('./water-quality').StationData>;
  networkSummary: import('./water-quality').NetworkSummary;
  activeScenario: ScenarioType;
  status: 'RUNNING' | 'PAUSED' | 'STOPPED';
  dataSource: 'simulation';
  lastUpdateMs: number;
}
