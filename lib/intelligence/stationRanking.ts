import { Insight, InsightSeverity, PriorityStation } from '../../types/insight';
import { StationData, ParameterType } from '../../types/water-quality';
import { Alert } from '../../types/alerts';
import { intelligenceConfig } from '../../config/intelligence';

export function calculateStationPriority(
  stations: Record<string, StationData>,
  alerts: Alert[]
): PriorityStation | null {
  
  const scores: Record<string, { score: number, reasons: string[], topParam?: ParameterType, topParamScore: number }> = {};

  Object.values(stations).forEach(station => {
    scores[station.id] = { score: 0, reasons: [], topParamScore: 0 };
    
    // Evaluate alerts for this station
    const stationAlerts = alerts.filter(a => a.stationId === station.id && (a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED'));
    
    stationAlerts.forEach(alert => {
      let alertScore = 0;
      if (alert.severity === 'CRITICAL') {
        alertScore = intelligenceConfig.priorityWeights.CRITICAL_ALERT;
        scores[station.id].reasons.push(`Critical alert for ${alert.parameter}`);
      } else if (alert.severity === 'WARNING') {
        alertScore = intelligenceConfig.priorityWeights.WARNING_ALERT;
        scores[station.id].reasons.push(`Warning alert for ${alert.parameter}`);
      }
      scores[station.id].score += alertScore;
      
      if (alertScore > scores[station.id].topParamScore) {
        scores[station.id].topParamScore = alertScore;
        scores[station.id].topParam = alert.parameter;
      }
    });

    // Evaluate current readings (anomalies)
    Object.values(station.readings).forEach(reading => {
      if (reading && reading.isAnomaly) {
        scores[station.id].score += intelligenceConfig.priorityWeights.ANOMALY_SCORE;
        scores[station.id].reasons.push(`Prototype anomaly detected for ${reading.parameter}`);
        if (intelligenceConfig.priorityWeights.ANOMALY_SCORE > scores[station.id].topParamScore) {
           scores[station.id].topParamScore = intelligenceConfig.priorityWeights.ANOMALY_SCORE;
           scores[station.id].topParam = reading.parameter;
        }
      }
    });
  });

  let topStation: PriorityStation | null = null;
  let maxScore = 0;

  Object.entries(scores).forEach(([stationId, data]) => {
    if (data.score > maxScore) {
      maxScore = data.score;
      topStation = {
        stationId,
        score: Math.min(data.score, 100), // Cap at 100
        reasons: data.reasons,
        topParameter: data.topParam
      };
    }
  });

  return topStation;
}
