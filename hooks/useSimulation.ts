import { useState, useEffect } from 'react';
import { simulator } from '../lib/simulation/simulator';
import { SimulationSnapshot, ScenarioType } from '../types/simulation';

export function useSimulation() {
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(simulator.getSnapshot());

  useEffect(() => {
    const unsubscribe = simulator.subscribe(setSnapshot);
    return () => { unsubscribe(); };
  }, []);

  return {
    snapshot,
    start: () => simulator.start(),
    pause: () => simulator.pause(),
    reset: () => simulator.reset(),
    injectAnomaly: (type: ScenarioType) => simulator.injectAnomaly(type),
    history: simulator.history
  };
}
