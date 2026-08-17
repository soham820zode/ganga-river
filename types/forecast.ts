import { ParameterType } from './water-quality';

export type ForecastHorizon = '24H' | '48H' | '72H';
export type ForecastStatus = 'NORMAL' | 'PROJECTED EXCEEDANCE' | 'INSUFFICIENT DATA' | 'LOADING';

export interface ForecastPoint {
  timestamp: number;
  value: number;
  lowerBound: number;
  upperBound: number;
  isThresholdCrossing: boolean;
}

export interface ThresholdCrossing {
  timestamp: number;
  value: number;
  threshold: number;
  direction: 'UP' | 'DOWN';
  severity: 'WARNING' | 'CRITICAL';
}

export interface ForecastResult {
  stationId: string;
  parameter: ParameterType;
  generatedAt: number;
  horizonHours: number;
  historicalPoints: { timestamp: number; value: number }[];
  forecastPoints: ForecastPoint[];
  modelName: string;
  modelVersion: string;
  referenceThreshold?: number;
  expectedTrend: 'Increasing' | 'Decreasing' | 'Stable';
  thresholdCrossings: ThresholdCrossing[];
  status: ForecastStatus;
  source: string;
}
