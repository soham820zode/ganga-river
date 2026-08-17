import { simulationConfig, parameterConfigs } from '../../config/simulation';
import { stationProfiles } from '../../config/profiles';
import { MOCK_STATIONS } from '../../config/stations';
import { ParameterType, StationData, ParameterReading, WaterQualityStatus } from '../../types/water-quality';
import { SimulationSnapshot, ScenarioType, AnomalyScenario } from '../../types/simulation';
import { generateNextReadingValue, calculateStatus } from './generators';
import { calculateTrend, generateNetworkSummary } from './aggregations';

type Listener = (snapshot: SimulationSnapshot) => void;

class JalPulseSimulator {
  private status: 'RUNNING' | 'PAUSED' | 'STOPPED' = 'STOPPED';
  private stations: Record<string, StationData> = {};
  private activeScenario: AnomalyScenario | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<Listener> = new Set();
  
  // History buffer (in-memory prototype)
  // Format: history[stationId][parameter] = [{timestamp, value}, ...]
  public history: Record<string, Record<string, { t: number, v: number }[]>> = {};

  constructor() {
    this.initialize();
  }

  private initialize() {
    const now = Date.now();
    this.history = {};
    this.stations = {};

    MOCK_STATIONS.forEach(mockSt => {
      const stId = mockSt.id;
      const profile = stationProfiles[stId];
      if (!profile) return;

      this.history[stId] = {};
      
      const readings = {} as Record<ParameterType, ParameterReading | null>;
      let stStatus: WaterQualityStatus = 'NORMAL';

      mockSt.availableParameters.forEach(p => {
        const param = p as ParameterType;
        const config = parameterConfigs[param];
        if (!config) return;

        this.history[stId][param] = [];
        
        // Generate historical buffer (48 hours)
        let simTime = now - (simulationConfig.historyDurationHours * 60 * 60 * 1000);
        const step = simulationConfig.historicalStepMinutes * 60 * 1000;
        
        let lastVal = profile.baselines[param];
        while (simTime <= now) {
          lastVal = generateNextReadingValue(lastVal, param, profile, config, simTime);
          this.history[stId][param].push({ t: simTime, v: lastVal });
          simTime += step;
        }

        const pStatus = calculateStatus(param, lastVal);
        if (pStatus === 'CRITICAL') stStatus = 'CRITICAL';
        else if (pStatus === 'WARNING' && stStatus !== 'CRITICAL') stStatus = 'WARNING';

        readings[param] = {
          parameter: param,
          value: Number(lastVal.toFixed(2)),
          unit: config.unit,
          timestamp: new Date(now).toISOString(),
          source: 'simulation',
          trend: 'STABLE',
          change: 0,
          quality: 'GOOD',
          status: pStatus,
          isAnomaly: false
        };
      });

      this.stations[stId] = {
        id: stId,
        name: mockSt.name,
        location: mockSt.region,
        status: stStatus,
        lastUpdated: new Date(now).toISOString(),
        readings,
        historyMetadata: { count: this.history[stId][mockSt.availableParameters[0]]?.length || 0, oldest: new Date(now - simulationConfig.historyDurationHours * 60 * 60 * 1000).toISOString() },
        simulationMetadata: { activeScenario: null }
      };
    });
  }

  public start() {
    if (this.status === 'RUNNING') return;
    this.status = 'RUNNING';
    this.intervalId = setInterval(() => this.tick(), simulationConfig.updateIntervalMs);
    this.notify();
  }

  public pause() {
    if (this.status === 'PAUSED' || this.status === 'STOPPED') return;
    this.status = 'PAUSED';
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.notify();
  }

  public reset() {
    this.pause();
    this.activeScenario = null;
    this.initialize();
    this.status = 'STOPPED';
    this.notify();
  }

  public injectAnomaly(type: ScenarioType) {
    if (type === 'NORMAL') {
      this.activeScenario = null;
      return;
    }
    this.activeScenario = {
      type,
      name: type,
      affectedStations: ['JLP-KAN-01', 'JLP-VAR-01'], // demo targets
      affectedParameters: type.includes('BOD') ? ['BOD', 'DO'] : ['Turbidity'],
      magnitudeMultiplier: type.includes('SPIKE') ? 2.5 : 0.5,
      startTime: Date.now(),
      durationMs: 5 * 60 * 1000 // 5 minutes demo
    };
    this.notify();
  }

  private tick() {
    const now = Date.now();
    
    // Check if scenario ended
    if (this.activeScenario && now > this.activeScenario.startTime + this.activeScenario.durationMs) {
      this.activeScenario = null;
    }

    Object.keys(this.stations).forEach(stId => {
      const profile = stationProfiles[stId];
      const stData = this.stations[stId];
      let stStatus: WaterQualityStatus = 'NORMAL';
      
      const isAffected = this.activeScenario?.affectedStations.includes(stId);

      Object.keys(stData.readings).forEach(p => {
        const param = p as ParameterType;
        const config = parameterConfigs[param];
        const prevReading = stData.readings[param];
        if (!config || !prevReading) return;

        let anomalyMult = 1.0;
        let isAnomaly = false;
        if (isAffected && this.activeScenario?.affectedParameters.includes(param)) {
          anomalyMult = this.activeScenario.magnitudeMultiplier;
          isAnomaly = true;
        }

        const nextVal = generateNextReadingValue(prevReading.value, param, profile, config, now, anomalyMult);
        const pStatus = calculateStatus(param, nextVal);
        const trend = calculateTrend(nextVal, prevReading.value);
        
        if (pStatus === 'CRITICAL') stStatus = 'CRITICAL';
        else if (pStatus === 'WARNING' && stStatus !== 'CRITICAL') stStatus = 'WARNING';

        // Update history
        this.history[stId][param].push({ t: now, v: nextVal });
        // Keep bounded (e.g. max 500 points for live buffer)
        if (this.history[stId][param].length > 500) this.history[stId][param].shift();

        stData.readings[param] = {
          ...prevReading,
          value: Number(nextVal.toFixed(2)),
          timestamp: new Date(now).toISOString(),
          status: pStatus,
          trend,
          isAnomaly
        };
      });

      stData.status = stStatus;
      stData.lastUpdated = new Date(now).toISOString();
      stData.simulationMetadata.activeScenario = this.activeScenario?.name || null;
    });

    this.notify();
  }

  public getSnapshot(): SimulationSnapshot {
    return {
      timestamp: new Date().toISOString(),
      stations: { ...this.stations },
      networkSummary: generateNetworkSummary(this.stations),
      activeScenario: this.activeScenario?.type || 'NORMAL',
      status: this.status,
      dataSource: 'simulation',
      lastUpdateMs: Date.now()
    };
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach(l => l(snap));
  }
}

export const simulator = new JalPulseSimulator();
