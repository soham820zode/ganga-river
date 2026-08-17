import { ForecastResult, ForecastPoint, ThresholdCrossing, ForecastStatus } from '../../types/forecast';
import { ParameterType } from '../../types/water-quality';
import { PARAMETER_METADATA } from '../../config/parameters';

export function generatePrototypeForecast(
  stationId: string,
  parameter: ParameterType,
  rawHistory: { t: number, v: number }[],
  horizonStr: '24H' | '48H' | '72H'
): ForecastResult {
  const horizonHours = parseInt(horizonStr.replace('H', ''));
  const now = Date.now();
  
  // Sort chronological
  const sorted = [...rawHistory].sort((a, b) => a.t - b.t);
  
  const historicalPoints = sorted.map(d => ({ timestamp: d.t, value: d.v }));

  const meta = PARAMETER_METADATA[parameter];
  let refVal: number | undefined;
  let isUpperLimit = true;
  
  if (meta.reference.includes('<') || meta.reference.includes('≤')) {
    refVal = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
    isUpperLimit = true;
  } else if (meta.reference.includes('>')) {
    refVal = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
    isUpperLimit = false; // like DO where < 4 is bad
  }

  if (sorted.length < 10) {
    return {
      stationId, parameter, generatedAt: now, horizonHours, historicalPoints,
      forecastPoints: [], modelName: 'Prototype Trend Forecast', modelVersion: '1.0',
      referenceThreshold: refVal, expectedTrend: 'Stable', thresholdCrossings: [],
      status: 'INSUFFICIENT DATA', source: 'Jal Pulse Demo Data'
    };
  }

  // Use last 12 hours for trend baseline
  const trendWindowMs = 12 * 60 * 60 * 1000;
  const recentPoints = sorted.filter(p => p.t >= now - trendWindowMs);
  const dataForTrend = recentPoints.length >= 5 ? recentPoints : sorted.slice(-10);

  // Linear regression slope (v per ms)
  const n = dataForTrend.length;
  const sumT = dataForTrend.reduce((sum, p) => sum + p.t, 0);
  const sumV = dataForTrend.reduce((sum, p) => sum + p.v, 0);
  const sumT2 = dataForTrend.reduce((sum, p) => sum + p.t * p.t, 0);
  const sumTV = dataForTrend.reduce((sum, p) => sum + p.t * p.v, 0);
  
  // Avoid division by zero
  const denom = (n * sumT2 - sumT * sumT);
  let slope = denom === 0 ? 0 : (n * sumTV - sumT * sumV) / denom;
  
  // Dampen the slope significantly for long-term forecast so it doesn't shoot to infinity
  slope = slope * 0.2;

  const baselineValue = sorted[sorted.length - 1].v;
  const lastTimestamp = sorted[sorted.length - 1].t;

  const forecastPoints: ForecastPoint[] = [];
  const crossings: ThresholdCrossing[] = [];
  let isCrossingDetected = false;

  const stepMs = 60 * 60 * 1000; // 1 hour steps
  let currentVal = baselineValue;
  
  // Variability for uncertainty band
  const variance = Math.max(0.1, Math.abs(baselineValue * 0.05));
  
  for (let t = lastTimestamp + stepMs; t <= now + horizonHours * 60 * 60 * 1000; t += stepMs) {
    const tDiff = t - lastTimestamp;
    
    // Periodic component (sin wave over 24h)
    const periodic = Math.sin((t / (24 * 60 * 60 * 1000)) * Math.PI * 2) * variance * 0.5;
    
    currentVal = baselineValue + (slope * tDiff) + periodic;
    
    // Clamp to 0
    if (currentVal < 0) currentVal = 0;

    // Uncertainty grows over time
    const uncertainty = variance + (tDiff / (24 * 60 * 60 * 1000)) * (variance * 1.5);
    let lower = currentVal - uncertainty;
    const upper = currentVal + uncertainty;
    if (lower < 0) lower = 0;

    let cross = false;
    if (refVal !== undefined) {
      if (isUpperLimit && currentVal > refVal) {
        cross = true;
        if (!isCrossingDetected) {
           isCrossingDetected = true;
           crossings.push({ timestamp: t, value: currentVal, threshold: refVal, direction: 'UP', severity: 'WARNING' });
        }
      } else if (!isUpperLimit && currentVal < refVal) {
        cross = true;
        if (!isCrossingDetected) {
           isCrossingDetected = true;
           crossings.push({ timestamp: t, value: currentVal, threshold: refVal, direction: 'DOWN', severity: 'WARNING' });
        }
      } else {
        isCrossingDetected = false;
      }
    }

    forecastPoints.push({
      timestamp: t,
      value: currentVal,
      lowerBound: lower,
      upperBound: upper,
      isThresholdCrossing: cross
    });
  }

  // Expected Trend
  const endVal = forecastPoints.length > 0 ? forecastPoints[forecastPoints.length - 1].value : baselineValue;
  const change = ((endVal - baselineValue) / (baselineValue || 1)) * 100;
  
  let expectedTrend: 'Increasing' | 'Decreasing' | 'Stable' = 'Stable';
  if (change > 5) expectedTrend = 'Increasing';
  if (change < -5) expectedTrend = 'Decreasing';

  const status: ForecastStatus = crossings.length > 0 ? 'PROJECTED EXCEEDANCE' : 'NORMAL';

  return {
    stationId,
    parameter,
    generatedAt: now,
    horizonHours,
    historicalPoints,
    forecastPoints,
    modelName: 'Prototype Trend Forecast',
    modelVersion: '1.0',
    referenceThreshold: refVal,
    expectedTrend,
    thresholdCrossings: crossings,
    status,
    source: 'Jal Pulse Demo Data'
  };
}
