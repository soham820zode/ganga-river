import { simulator } from '../simulation/simulator';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { StationData, ParameterType } from '../../types/water-quality';
import { Insight } from '../../types/insight';
import { analyzeCurrentSignal, analyzeNetwork } from './signalAnalysis';
import { analyzeTrend } from './trendAnalysis';
import { calculateStationPriority } from './stationRanking';
import { generateRecommendation } from './recommendationEngine';
import { intelligenceConfig } from '../../config/intelligence';

export class JalPulseInsightEngine {
  private lastUpdate: Record<string, number> = {};

  constructor() {
    // We subscribe to the simulator to get data ticks
    simulator.subscribe((snapshot) => {
      this.processTick(snapshot.stations);
    });
  }

  private processTick(stations: Record<string, StationData>) {
    const store = useJalPulseStore.getState();
    const now = Date.now();
    const insightsToPublish: Insight[] = [];

    // Process Station-Level Insights
    Object.values(stations).forEach(station => {
      Object.keys(station.readings).forEach(p => {
        const param = p as ParameterType;
        
        // 1. Current Status / Threshold Insights
        const currentInsight = analyzeCurrentSignal(station.id, station, param);
        if (currentInsight) {
          if (this.shouldUpdate(currentInsight.fingerprint, now, intelligenceConfig.cooldownMs.CURRENT_STATUS)) {
            // Apply recommendation
            const rec = generateRecommendation(currentInsight);
            if (rec) currentInsight.recommendation = rec;
            insightsToPublish.push(currentInsight);
            this.lastUpdate[currentInsight.fingerprint] = now;
          }
        }

        // 2. Trend Insights
        const history = simulator.history[station.id]?.[param];
        if (history) {
          const trendInsight = analyzeTrend(station.id, param, history);
          if (trendInsight) {
            if (this.shouldUpdate(trendInsight.fingerprint, now, intelligenceConfig.cooldownMs.TREND_CHANGE)) {
               const rec = generateRecommendation(trendInsight);
               if (rec) trendInsight.recommendation = rec;
               insightsToPublish.push(trendInsight);
               this.lastUpdate[trendInsight.fingerprint] = now;
            }
          }
        }
      });
    });

    // 3. Network Summary
    const networkInsight = analyzeNetwork(stations);
    if (this.shouldUpdate(networkInsight.fingerprint, now, intelligenceConfig.cooldownMs.NETWORK_SUMMARY)) {
      insightsToPublish.push(networkInsight);
      this.lastUpdate[networkInsight.fingerprint] = now;
    }

    // 4. Update Store (Insights & Priority Station)
    if (insightsToPublish.length > 0) {
      store.addOrUpdateInsights(insightsToPublish);
    }
    
    // Always recalculate priority station on tick
    const priorityStation = calculateStationPriority(stations, store.alerts);
    store.setPriorityStation(priorityStation);
  }

  private shouldUpdate(fingerprint: string, now: number, cooldownMs: number): boolean {
    const last = this.lastUpdate[fingerprint] || 0;
    return now - last >= cooldownMs;
  }
}

// Singleton initialization
export const insightEngine = new JalPulseInsightEngine();
