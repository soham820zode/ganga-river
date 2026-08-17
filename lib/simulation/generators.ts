import { ParameterConfig, StationProfile } from '../../types/simulation';
import { ParameterType, WaterQualityStatus } from '../../types/water-quality';
import { prototypeReferenceRange } from '../../config/thresholds';

export function calculateStatus(parameter: ParameterType, value: number): WaterQualityStatus {
  const range = (prototypeReferenceRange as Record<string, {min: number|null, max: number|null}>)[parameter];
  if (!range) return 'NORMAL';
  
  const { min, max } = range;
  
  // Simple prototype logic: outside min/max is WARNING. Further out is CRITICAL.
  if (min !== null && value < min) {
    if (value < min * 0.8) return 'CRITICAL';
    return 'WARNING';
  }
  if (max !== null && value > max) {
    if (value > max * 1.2) return 'CRITICAL';
    return 'WARNING';
  }
  
  return 'NORMAL';
}

export function generateNextReadingValue(
  prevValue: number,
  parameter: ParameterType,
  profile: StationProfile,
  config: ParameterConfig,
  timeMs: number,
  anomalyMultiplier: number = 1.0
): number {
  const baseline = profile.baselines[parameter];
  const variability = profile.variabilityMultiplier;
  
  // Math.sin for smooth periodic variation over hours
  const hours = timeMs / (1000 * 60 * 60);
  const periodic = Math.sin(hours * Math.PI) * config.periodicStrength;
  
  // Small random walk (noise)
  const noise = (Math.random() - 0.5) * config.noiseScale * variability;
  
  // Gentle reversion to baseline
  const pullToBaseline = (baseline - prevValue) * 0.05;

  let next = prevValue + periodic + noise + pullToBaseline;
  
  // Apply anomalies
  if (anomalyMultiplier !== 1.0) {
    next = next + (next * (anomalyMultiplier - 1.0) * 0.1); // Gradual pull towards anomaly magnitude
  }

  // Clamp
  return Math.max(config.minClamp, Math.min(config.maxClamp, next));
}
