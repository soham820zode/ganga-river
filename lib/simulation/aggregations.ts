import { StationData, NetworkSummary } from '../../types/water-quality';
import { TrendDirection } from '../../types/water-quality';

export function calculateTrend(current: number, prev: number): TrendDirection {
  const diff = current - prev;
  const threshold = current * 0.01; // 1% change
  if (diff > threshold) return 'UP';
  if (diff < -threshold) return 'DOWN';
  return 'STABLE';
}

export function generateNetworkSummary(stations: Record<string, StationData>): NetworkSummary {
  const stList = Object.values(stations);
  
  let phSum = 0, doSum = 0, bodSum = 0, tempSum = 0, turbSum = 0;
  let warnCount = 0, critCount = 0;
  
  stList.forEach(st => {
    if (st.status === 'WARNING') warnCount++;
    if (st.status === 'CRITICAL') critCount++;
    
    phSum += st.readings['pH']?.value || 0;
    doSum += st.readings['DO']?.value || 0;
    bodSum += st.readings['BOD']?.value || 0;
    tempSum += st.readings['Temperature']?.value || 0;
    turbSum += st.readings['Turbidity']?.value || 0;
  });
  
  const count = stList.length || 1;
  
  return {
    averagePH: Number((phSum / count).toFixed(2)),
    averageDO: Number((doSum / count).toFixed(2)),
    averageBOD: Number((bodSum / count).toFixed(2)),
    averageTemp: Number((tempSum / count).toFixed(1)),
    averageTurbidity: Number((turbSum / count).toFixed(1)),
    stationCount: stList.length,
    warningCount: warnCount,
    criticalCount: critCount
  };
}
