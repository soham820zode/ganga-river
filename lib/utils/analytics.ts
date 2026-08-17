import { ParameterType } from '../../types/water-quality';

export interface HistoryPoint {
  t: number;
  v: number;
}

export function getHistoryForRange(
  rawHistory: Record<string, Record<string, HistoryPoint[]>>,
  stationId: string | null, // null for NETWORK (aggregates all)
  parameter: ParameterType,
  rangeStr: '1H' | '6H' | '24H' | '48H' | '72H'
) {
  const hours = parseInt(rangeStr.replace('H', ''));
  const now = Date.now();
  const startTime = now - (hours * 60 * 60 * 1000);

  if (stationId) {
    const data = rawHistory[stationId]?.[parameter] || [];
    return data.filter(d => d.t >= startTime);
  } else {
    // Network average
    const stations = Object.values(rawHistory);
    if (!stations.length) return [];
    
    // Assume all stations have same timestamps for prototype
    const st1 = stations[0][parameter] || [];
    const filtered = st1.filter(d => d.t >= startTime);
    
    return filtered.map(pt => {
      let sum = 0;
      let count = 0;
      stations.forEach(st => {
        const matching = st[parameter]?.find(p => p.t === pt.t);
        if (matching) {
          sum += matching.v;
          count++;
        }
      });
      return { t: pt.t, v: count > 0 ? sum / count : pt.v };
    });
  }
}

export function downsampleTimeSeries(data: HistoryPoint[], maxPoints: number = 100): HistoryPoint[] {
  if (data.length <= maxPoints) return data;
  const factor = Math.ceil(data.length / maxPoints);
  const result: HistoryPoint[] = [];
  for (let i = 0; i < data.length; i += factor) {
    result.push(data[i]);
  }
  return result;
}

export function calculateHistoricalStats(data: HistoryPoint[], threshold?: string) {
  if (!data.length) return { min: 0, max: 0, avg: 0, change: 0, crossings: 0 };
  
  const values = data.map(d => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  const first = values[0];
  const last = values[values.length - 1];
  const change = first !== 0 ? ((last - first) / first) * 100 : 0;
  
  let crossings = 0;
  if (threshold) {
    const val = parseFloat(threshold.replace(/[^0-9.]/g, ''));
    if (!isNaN(val)) {
      const isAbove = (threshold.includes('<') || threshold.includes('≤'));
      for (let i = 1; i < data.length; i++) {
        const prev = data[i-1].v;
        const curr = data[i].v;
        if (isAbove) {
          if ((prev <= val && curr > val) || (prev > val && curr <= val)) crossings++;
        } else {
          if ((prev >= val && curr < val) || (prev < val && curr >= val)) crossings++;
        }
      }
    }
  }

  return { min, max, avg, change, crossings };
}
