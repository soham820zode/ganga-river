import { ParameterType } from '../../types/water-quality';
import { Insight } from '../../types/insight';
import { PARAMETER_METADATA } from '../../config/parameters';
import { intelligenceConfig } from '../../config/intelligence';
import { MOCK_STATIONS } from '../../config/stations';
import { simulationConfig } from '../../config/simulation';

export function analyzeTrend(
  stationId: string, 
  param: ParameterType, 
  historyBuffer: { t: number, v: number }[]
): Insight | null {
  if (!historyBuffer || historyBuffer.length < 2) return null;

  const meta = PARAMETER_METADATA[param];
  const stationName = MOCK_STATIONS.find(s => s.id === stationId)?.name || stationId;

  // Let's use a 6-hour window for trend analysis if available, otherwise just use what we have
  const now = historyBuffer[historyBuffer.length - 1].t;
  const sixHoursMs = 6 * 60 * 60 * 1000;
  const targetStartTime = now - sixHoursMs;

  let startIndex = 0;
  for (let i = historyBuffer.length - 1; i >= 0; i--) {
    if (historyBuffer[i].t <= targetStartTime) {
      startIndex = i;
      break;
    }
  }

  const startVal = historyBuffer[startIndex].v;
  const endVal = historyBuffer[historyBuffer.length - 1].v;
  
  const changeRaw = endVal - startVal;
  const changePct = startVal > 0 ? (changeRaw / startVal) * 100 : 0;
  
  const absoluteChangePct = Math.abs(changePct);
  
  let template = intelligenceConfig.templates.TREND_STABLE;
  let title = 'STABILITY INSIGHT';
  const severity: Insight['severity'] = 'INFO';
  let trend: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';

  if (absoluteChangePct > 5) {
    if (changePct > 0) {
       template = intelligenceConfig.templates.TREND_INCREASE;
       title = 'TREND';
       trend = 'INCREASING';
    } else {
       template = intelligenceConfig.templates.TREND_DECREASE;
       title = 'TREND';
       trend = 'DECREASING';
    }
  }

  const summary = template
    .replace('{parameter}', meta.displayName)
    .replace('{station}', stationName)
    .replace('{change}', absoluteChangePct.toFixed(1))
    .replace('{window}', '6H');

  return {
    id: crypto.randomUUID(),
    fingerprint: `${stationId}-${param}-TREND`,
    type: 'TREND_CHANGE',
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
      value: endVal,
      change: changePct,
      trend,
      historicalWindow: '6H',
      source: 'SIMULATION_HISTORY'
    },
    recommendation: {
      id: crypto.randomUUID(),
      type: 'REVIEW_HISTORY',
      title: 'Review Historical Trend',
      description: 'Check the 24H or 48H chart to confirm if this trend is anomalous or part of a periodic cycle.',
      priority: 'LOW',
      relatedStation: stationId,
      relatedParameter: param
    }
  };
}
