import { ParameterType } from './water-quality';

export type InsightType = 
  | 'CURRENT_STATUS'
  | 'TREND_CHANGE'
  | 'ANOMALY'
  | 'THRESHOLD'
  | 'FORECAST'
  | 'RECOVERY'
  | 'STATION_PRIORITY'
  | 'NETWORK_SUMMARY'
  | 'DATA_QUALITY'
  | 'RESPONSE';

export type InsightSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export type RecommendationType = 
  | 'REVIEW_STATION'
  | 'REVIEW_HISTORY'
  | 'REVIEW_FORECAST'
  | 'ACKNOWLEDGE_ALERT'
  | 'NOTIFY_TEAM'
  | 'MONITOR'
  | 'VERIFY_DATA';

export interface Evidence {
  parameter?: ParameterType;
  value?: number;
  reference?: string | number;
  change?: number; // percentage or absolute
  trend?: 'INCREASING' | 'DECREASING' | 'STABLE';
  historicalWindow?: string;
  forecastWindow?: string;
  alertId?: string;
  anomalyScore?: number;
  source: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  relatedStation?: string;
  relatedParameter?: ParameterType;
  relatedAlert?: string;
  relatedForecast?: string;
}

export interface Insight {
  id: string;
  fingerprint: string;
  type: InsightType;
  title: string;
  summary: string;
  severity: InsightSeverity;
  stationId?: string;
  parameter?: ParameterType;
  createdAt: string;
  updatedAt: string;
  source: string;
  evidence?: Evidence;
  recommendation?: Recommendation;
  isSimulated: boolean;
  relatedAlertId?: string;
  relatedForecast?: string;
  confidenceLevel: 'SUPPORTED' | 'LIMITED_DATA' | 'INSUFFICIENT_DATA';
  status: 'NEW' | 'ACTIVE' | 'UPDATED' | 'RESOLVED' | 'EXPIRED';
}

export interface PriorityStation {
  stationId: string;
  score: number;
  reasons: string[];
  topParameter?: ParameterType;
}
