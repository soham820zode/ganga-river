import { StationData, ParameterType } from '../../types/water-quality';
import { Insight, InsightSeverity } from '../../types/insight';
import { PARAMETER_METADATA } from '../../config/parameters';
import { intelligenceConfig } from '../../config/intelligence';
import { MOCK_STATIONS } from '../../config/stations';

export function analyzeCurrentSignal(stationId: string, stationData: StationData, param: ParameterType): Insight | null {
  const reading = stationData.readings[param];
  if (!reading) return null;

  const meta = PARAMETER_METADATA[param];
  if (!meta) return null;

  const stationName = MOCK_STATIONS.find(s => s.id === stationId)?.name || stationId;
  const value = reading.value;
  let isExceeded = false;
  let isBelow = false;
  let refValue = 0;

  if (meta.reference.includes('<') || meta.reference.includes('≤')) {
    refValue = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
    if (value > refValue) isExceeded = true;
  } else if (meta.reference.includes('>')) {
    refValue = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
    if (value < refValue) isBelow = true;
  }

  let template = intelligenceConfig.templates.CURRENT_STATUS_NORMAL;
  let severity: InsightSeverity = 'INFO';
  let title = 'CURRENT MONITORING STATUS';
  let type: Insight['type'] = 'CURRENT_STATUS';

  if (reading.isAnomaly) {
    template = intelligenceConfig.templates.ANOMALY_DETECTED;
    severity = 'CRITICAL';
    title = 'ANOMALY DETECTED';
    type = 'ANOMALY';
  } else if (isExceeded) {
    template = intelligenceConfig.templates.THRESHOLD_EXCEEDED;
    severity = 'WARNING';
    title = 'REFERENCE EXCEEDED';
    type = 'THRESHOLD';
  } else if (isBelow) {
    template = intelligenceConfig.templates.THRESHOLD_BELOW;
    severity = 'WARNING';
    title = 'BELOW REFERENCE';
    type = 'THRESHOLD';
  }

  const summary = template
    .replace('{parameter}', meta.displayName)
    .replace('{station}', stationName)
    .replace('{direction}', isExceeded ? 'increase' : 'decrease'); // for anomaly

  return {
    id: crypto.randomUUID(),
    fingerprint: `${stationId}-${param}-${type}`,
    type,
    title,
    summary,
    severity,
    stationId,
    parameter: param,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'SIMULATED DATA',
    isSimulated: true,
    confidenceLevel: 'SUPPORTED',
    status: 'NEW',
    evidence: {
      parameter: param,
      value: reading.value,
      reference: meta.reference,
      change: 0,
      source: 'SIMULATION_ENGINE'
    },
    recommendation: {
      id: crypto.randomUUID(),
      type: type === 'THRESHOLD' || type === 'ANOMALY' ? 'REVIEW_STATION' : 'MONITOR',
      title: type === 'THRESHOLD' || type === 'ANOMALY' ? 'Review Station Data' : 'Continue Monitoring',
      description: 'Review the current simulated data for this station to confirm the condition.',
      priority: type === 'THRESHOLD' || type === 'ANOMALY' ? 'HIGH' : 'LOW',
      relatedStation: stationId,
      relatedParameter: param
    }
  };
}

export function analyzeNetwork(stations: Record<string, StationData>): Insight {
  let issues = 0;
  
  Object.values(stations).forEach(station => {
    Object.values(station.readings).forEach(reading => {
      if (reading && (reading.status === 'WARNING' || reading.status === 'CRITICAL' || reading.isAnomaly)) {
        issues++;
      }
    });
  });

  const template = issues > 0 
    ? intelligenceConfig.templates.NETWORK_ISSUES 
    : intelligenceConfig.templates.NETWORK_NORMAL;

  const summary = template.replace('{count}', issues.toString());

  return {
    id: crypto.randomUUID(),
    fingerprint: 'NETWORK_SUMMARY',
    type: 'NETWORK_SUMMARY',
    title: 'NETWORK STATUS',
    summary,
    severity: issues > 0 ? 'WARNING' : 'INFO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'SIMULATED DATA',
    isSimulated: true,
    confidenceLevel: 'SUPPORTED',
    status: 'NEW',
    evidence: {
      source: 'SIMULATION_ENGINE',
      value: issues
    }
  };
}
