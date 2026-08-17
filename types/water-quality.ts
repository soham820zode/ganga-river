export type ParameterType = 'pH' | 'DO' | 'BOD' | 'Temperature' | 'Turbidity';

export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';
export type DataQuality = 'GOOD' | 'DEGRADED' | 'ANOMALOUS' | 'UNAVAILABLE';
export type WaterQualityStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type DataSource = 'simulation' | 'sensor' | 'manual';

export interface ParameterReading {
  parameter: ParameterType;
  value: number;
  unit: string;
  timestamp: string;
  source: DataSource;
  trend: TrendDirection;
  change: number; // percentage or absolute delta
  quality: DataQuality;
  status: WaterQualityStatus;
  isAnomaly: boolean;
}

export interface StationData {
  id: string;
  name: string;
  location: string;
  status: WaterQualityStatus;
  lastUpdated: string;
  readings: Record<ParameterType, ParameterReading | null>;
  historyMetadata: { count: number; oldest: string };
  simulationMetadata: { activeScenario: string | null };
}

export interface NetworkSummary {
  averagePH: number;
  averageDO: number;
  averageBOD: number;
  averageTemp: number;
  averageTurbidity: number;
  stationCount: number;
  warningCount: number;
  criticalCount: number;
}
