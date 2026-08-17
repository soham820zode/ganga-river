import { ParameterType } from './water-quality';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';
export type AlertType = 'THRESHOLD_EXCEEDED' | 'RAPID_CHANGE' | 'ANOMALY' | 'PROJECTED_THRESHOLD_CROSSING' | 'RECOVERY';

export interface Alert {
  id: string; // unique event id
  fingerprint: string; // stable identifier for deduplication (e.g. station-parameter-type)
  stationId: string;
  parameter: ParameterType;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  
  occurrences: number; // For deduplication/persistence
  
  currentValue: number;
  referenceThreshold?: number;
  message: string;
  
  source: 'SIMULATION_ENGINE' | 'FORECAST_ENGINE' | 'ANOMALY_DETECTOR';
  isProjected: boolean;
  isSimulated: boolean;
  
  metadata?: {
    modelName?: string;
    anomalyScore?: number;
    projectedTime?: string;
  };
}
