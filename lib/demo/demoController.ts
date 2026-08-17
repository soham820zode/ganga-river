import { useDemoStore } from '../../store/useDemoStore';
import { DEMO_SCENARIOS } from './demoScenarios';
import { simulator } from '../simulation/simulator';
import { useJalPulseStore } from '../../store/useJalPulseStore';

class DemoController {
  private autoPlayTimer: ReturnType<typeof setTimeout> | null = null;
  private routerPush: ((url: string) => void) | null = null;

  public setRouter(push: (url: string) => void) {
    this.routerPush = push;
  }

  public startDemo(scenarioId: string) {
    const store = useDemoStore.getState();
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    
    if (!scenario) return;

    store.setDemoActive(true);
    store.setCurrentScenario(scenarioId);
    store.setIsPlaying(false);
    
    // Reset underlying systems
    simulator.reset();
    simulator.start();

    // Reset UI selections
    const pulseStore = useJalPulseStore.getState();
    pulseStore.setSelectedStation(scenario.affectedStations[0] || null);

    this.executeStep(0);
  }

  public nextStep() {
    const store = useDemoStore.getState();
    const scenario = this.getCurrentScenario();
    if (!scenario) return;

    const nextIdx = store.currentStepIndex + 1;
    if (nextIdx < scenario.steps.length) {
      store.setCurrentStepIndex(nextIdx);
      this.executeStep(nextIdx);
    } else {
      // Demo complete
      this.pauseDemo();
      if (this.routerPush) this.routerPush('/demo/summary');
    }
  }

  public previousStep() {
    const store = useDemoStore.getState();
    const prevIdx = store.currentStepIndex - 1;
    if (prevIdx >= 0) {
      store.setCurrentStepIndex(prevIdx);
      this.executeStep(prevIdx);
    }
  }

  public pauseDemo() {
    useDemoStore.getState().setIsPlaying(false);
    if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
  }

  public resumeDemo() {
    useDemoStore.getState().setIsPlaying(true);
    // Note: Auto-play logic could be added here to schedule nextStep based on step.durationMs
  }

  public exitDemo() {
    this.pauseDemo();
    useDemoStore.getState().resetDemo();
    simulator.reset();
    simulator.start(); // Start normal baseline mode
    if (this.routerPush) this.routerPush('/');
  }

  private executeStep(index: number) {
    const scenario = this.getCurrentScenario();
    if (!scenario) return;
    
    const step = scenario.steps[index];

    // Handle routing
    if (this.routerPush && step.route) {
      this.routerPush(step.route);
    }

    // Orchestrate underlying system logic based on phase
    if (step.phase === 'DETECT') {
      simulator.injectAnomaly(scenario.simulationType);
    } else if (step.phase === 'RECOVER') {
      simulator.injectAnomaly('NORMAL'); // Stop anomaly to recover
    }

    // Handle custom actions if defined
    if (step.action) {
      step.action();
    }
  }

  public getCurrentScenario() {
    const store = useDemoStore.getState();
    return DEMO_SCENARIOS.find((s) => s.id === store.currentScenarioId) || null;
  }
}

export const demoController = new DemoController();
