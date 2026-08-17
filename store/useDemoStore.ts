import { create } from 'zustand';
import { DemoState } from '../types/demo';

interface DemoStore extends DemoState {
  setDemoActive: (active: boolean) => void;
  setPresenterMode: (active: boolean) => void;
  setCurrentScenario: (id: string | null) => void;
  setCurrentStepIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  resetDemo: () => void;
}

const initialState: DemoState = {
  isDemoActive: false,
  isPresenterMode: false,
  currentScenarioId: null,
  currentStepIndex: 0,
  isPlaying: false,
};

export const useDemoStore = create<DemoStore>((set) => ({
  ...initialState,
  
  setDemoActive: (active) => set({ isDemoActive: active }),
  setPresenterMode: (active) => set({ isPresenterMode: active }),
  setCurrentScenario: (id) => set({ currentScenarioId: id, currentStepIndex: 0 }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  resetDemo: () => set({ ...initialState }),
}));
