import { Insight, Recommendation } from '../../types/insight';

export function generateRecommendation(insight: Insight): Recommendation | undefined {
  if (insight.type === 'ANOMALY' || insight.severity === 'CRITICAL') {
    return {
      id: crypto.randomUUID(),
      type: 'NOTIFY_TEAM',
      title: 'Notify Response Team',
      description: 'The simulated data shows a critical anomaly or threshold crossing. Consider triggering the prototype response workflow.',
      priority: 'HIGH',
      relatedStation: insight.stationId,
      relatedParameter: insight.parameter
    };
  }
  
  if (insight.type === 'THRESHOLD' && insight.severity === 'WARNING') {
    return {
      id: crypto.randomUUID(),
      type: 'REVIEW_STATION',
      title: 'Review Station',
      description: 'Review the station data to confirm the threshold crossing in the simulated environment.',
      priority: 'MEDIUM',
      relatedStation: insight.stationId,
      relatedParameter: insight.parameter
    };
  }

  if (insight.type === 'FORECAST' || (insight.type === 'TREND_CHANGE' && insight.evidence?.trend !== 'STABLE')) {
    return {
      id: crypto.randomUUID(),
      type: 'REVIEW_FORECAST',
      title: 'Review Forecast Outlook',
      description: 'Check the prototype forecast to see if this trend is projected to result in a reference crossing.',
      priority: 'MEDIUM',
      relatedStation: insight.stationId,
      relatedParameter: insight.parameter
    };
  }

  return undefined;
}
