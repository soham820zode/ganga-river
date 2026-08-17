import { ScenarioType } from './simulation';

export type DemoPhase =
  | 'ORIENT'
  | 'MONITOR'
  | 'ANALYZE'
  | 'FORECAST'
  | 'DETECT'
  | 'NOTIFY'
  | 'RESPOND'
  | 'RECOVER';

export interface DemoStep {
  id: string;
  title: string;
  phase: DemoPhase;
  description: string; // Presenter description
  talkingPoint: string; // Suggested script
  durationMs?: number; // Optional duration for auto-play
  action?: () => void; // Side effect when entering step
  route: string; // The URL route this step corresponds to (e.g., '/', '/monitoring', '/intelligence')
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  affectedStations: string[];
  affectedParameters: string[];
  expectedWorkflow: string;
  simulationType: ScenarioType;
  steps: DemoStep[];
}

export interface DemoState {
  isDemoActive: boolean;
  isPresenterMode: boolean;
  currentScenarioId: string | null;
  currentStepIndex: number;
  isPlaying: boolean;
}
